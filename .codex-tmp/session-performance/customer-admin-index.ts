import postgres from 'npm:postgres@3.4.7'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
})
const env = (name: string) => {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing ${name}`)
  return value
}
const isUuid = (value: unknown): value is string => typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
const safeEqual = (left: string, right: string) => {
  const a = new TextEncoder().encode(left)
  const b = new TextEncoder().encode(right)
  let difference = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) difference |= (a[i] ?? 0) ^ (b[i] ?? 0)
  return difference === 0
}
const adminSecret = () => env('MPHONE_CUSTOMER_ADMIN_SECRET').trim()
const canonicalEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : ''
const validEmail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  const provided = req.headers.get('x-mphone-admin-secret') ?? ''
  if (!provided || !safeEqual(provided, adminSecret())) return json({ error: 'unauthorized' }, 401)
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'invalid_request' }, 400) }
  const action = typeof body.action === 'string' ? body.action : ''
  const operatorUserUuid = body.operator_user_uuid
  const operatorDomainUuid = body.operator_domain_uuid
  if (action === 'runtime_service_entitlement_check') {
    const fusionDomainUuid = body.fusion_domain_uuid
    const extensionUuid = body.extension_uuid
    const capability = String(body.capability ?? '')
    const allowedCapabilities = ['call_recording','recording_download','speech_to_text','ai_summary','auto_dialer']
    if (!isUuid(fusionDomainUuid) || !isUuid(extensionUuid) || !allowedCapabilities.includes(capability)) {
      return json({ error: 'invalid_request' }, 400)
    }
    const db = postgres(env('SUPABASE_DB_URL'), { max: 1, connect_timeout: 5 })
    try {
      const ownership = await db`select ce.customer_uuid::text from public.mphone_customer_extensions ce
        join public.mphone_customer_tenants ct on ct.customer_uuid=ce.customer_uuid and ct.status='active'
        join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where ce.extension_uuid=${extensionUuid}::uuid and ce.status='active'
          and t.fusion_domain_uuid=${fusionDomainUuid}::uuid limit 1`
      if (ownership.length !== 1) return json({ error: 'customer_not_found' }, 404)
      const customerUuid = ownership[0].customer_uuid
      const rows = await db`select subscription_uuid::text,capabilities,checksum,status,generation,enforcement_mode
        from public.mphone_resolved_entitlements where customer_uuid=${customerUuid}::uuid
        order by case when status='active' then 0 else 1 end,resolved_at desc limit 1`
      const entitlement = rows[0]
      const effectiveAllowed = entitlement?.status === 'active' && entitlement?.capabilities?.[capability] === true
      const enforcementMode = entitlement?.enforcement_mode ?? 'observe'
      if (!effectiveAllowed) await db`insert into public.mphone_entitlement_runtime_events
        (customer_uuid,fusion_domain_uuid,extension_uuid,service_name,capability_key,result,
          entitlement_generation,entitlement_checksum,details)
        values (${customerUuid}::uuid,${fusionDomainUuid}::uuid,${extensionUuid}::uuid,'worker',${capability},
          ${enforcementMode === 'observe' ? 'observed_denial' : 'denied'},${entitlement?.generation ?? null},
          ${entitlement?.checksum ?? null},${db.json({ subscription_uuid:entitlement?.subscription_uuid ?? null })})`
      return json({ customer_uuid:customerUuid,allowed:enforcementMode === 'observe' || effectiveAllowed,
        effective_allowed:effectiveAllowed,enforcement_mode:enforcementMode,
        generation:entitlement?.generation ?? null,checksum:entitlement?.checksum ?? null })
    } finally {
      await db.end({ timeout: 1 })
    }
  }
  if (!isUuid(operatorUserUuid) || (operatorDomainUuid !== null && !isUuid(operatorDomainUuid))) {
    return json({ error: 'invalid_operator' }, 400)
  }
  const db = postgres(env('SUPABASE_DB_URL'), { max: 1, connect_timeout: 5 })
  const fusion = postgres(env('FUSIONPBX_DATABASE_URL'), { max: 1, connect_timeout: 5 })
  const audit = async (result: string, targetType?: string, targetUuid?: string, details = {}) => {
    await db`insert into public.mphone_customer_admin_events
      (operator_user_uuid, operator_domain_uuid, action, result, target_type, target_uuid, details)
      values (${operatorUserUuid}::uuid, ${operatorDomainUuid || null}::uuid, ${action}, ${result},
        ${targetType || null}, ${targetUuid || null}::uuid, ${db.json(details)})`
  }
  try {
    const operators = await fusion`select user_uuid::text from v_users
      where user_uuid=${operatorUserUuid}::uuid and domain_uuid=${operatorDomainUuid}::uuid
        and user_enabled::text='true' limit 1`
    if (operators.length !== 1) return json({ error: 'invalid_operator' }, 403)
    if (action === 'runtime_entitlement_check') {
      const customerUuid = body.customer_uuid
      const capability = String(body.capability ?? '')
      const allowedCapabilities = ['call_forwarding','external_forwarding','call_history','outbound_calling',
        'call_statistics','call_recording','recording_download','speech_to_text','ai_summary','auto_dialer',
        'ai_auto_answer']
      if (!isUuid(customerUuid) || !allowedCapabilities.includes(capability)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const scoped = await db`select 1 from public.mphone_customer_tenants ct
        join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where ct.customer_uuid=${customerUuid}::uuid and ct.status='active'
          and t.fusion_domain_uuid=${operatorDomainUuid}::uuid limit 1`
      if (scoped.length !== 1) return json({ error: 'forbidden' }, 403)
      const rows = await db`select subscription_uuid::text,capabilities,checksum,status,generation,enforcement_mode
        from public.mphone_resolved_entitlements where customer_uuid=${customerUuid}::uuid
        order by case when status='active' then 0 else 1 end,resolved_at desc limit 1`
      const entitlement = rows[0]
      const effectiveAllowed = entitlement?.status === 'active' && entitlement?.capabilities?.[capability] === true
      const enforcementMode = entitlement?.enforcement_mode ?? 'observe'
      const allowed = enforcementMode === 'observe' || effectiveAllowed
      if (!effectiveAllowed) await audit(enforcementMode === 'observe' ? 'observed_denial' : 'denied',
        'customer',customerUuid,{ capability,subscription_uuid:entitlement?.subscription_uuid ?? null,
          generation:entitlement?.generation ?? null,checksum:entitlement?.checksum ?? null,runtime:true })
      return json({ allowed,effective_allowed:effectiveAllowed,enforcement_mode:enforcementMode,
        generation:entitlement?.generation ?? null,checksum:entitlement?.checksum ?? null })
    }
    if (['customer_manage_list', 'customer_manage_detail', 'customer_manage_create',
      'customer_manage_update', 'customer_manage_status', 'customer_manage_sync_retry',
      'customer_manage_extension_transfer', 'customer_profile_change_approve',
      'customer_profile_change_reject', 'customer_profile_change_retry'].includes(action)) {
      if (body.actor_superadmin !== true) return json({ error: 'forbidden' }, 403)
    }
    if (action === 'customer_manage_list') {
      const missingOwners = await db`select c.customer_uuid::text, min(m.membership_uuid::text) as membership_uuid
        from public.mphone_customers c join public.mphone_memberships m on m.customer_uuid=c.customer_uuid
        where c.status='active' and m.status<>'removed'
          and not exists (select 1 from public.mphone_memberships owner_membership
            where owner_membership.customer_uuid=c.customer_uuid and owner_membership.role='owner'
              and owner_membership.status<>'removed')
        group by c.customer_uuid having count(*)=1`
      if (missingOwners.length > 0) {
        await db`update public.mphone_memberships set role='owner', updated_at=now()
          where membership_uuid=any(${missingOwners.map((row) => row.membership_uuid)}::uuid[])`
        await audit('accepted', 'customer', undefined,
          { reconciliation: 'single_member_promoted_to_owner', customers: missingOwners.length })
      }
      const customers = await db`select c.customer_uuid::text, c.customer_code, c.display_name,
        c.customer_type, c.status, c.origin_system, c.created_at::text, c.updated_at::text,
        p.legal_name, p.contact_email, p.phone, p.source_updated_at::text as profile_source_updated_at,
        r.external_id, r.last_synced_at::text, r.sync_status as external_sync_status,
        latest_outbox.status as outbox_status, latest_outbox.last_error_code,
        subscription.subscription_uuid::text, subscription.display_name as subscription_name,
        subscription.billing_cycle, subscription.billable_quantity, subscription.total_amount,
        subscription.currency as subscription_currency, subscription.status as subscription_status,
        subscription.period_end::text as subscription_period_end,
        count(distinct m.membership_uuid) filter (where m.status<>'removed')::int as membership_count,
        count(distinct ce.extension_uuid) filter (where ce.status='active')::int as extension_count,
        max(i.primary_email) filter (where m.role='owner' and m.status='active') as owner_email
        from public.mphone_customers c
        left join public.mphone_memberships m on m.customer_uuid=c.customer_uuid
        left join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        left join public.mphone_customer_extensions ce on ce.customer_uuid=c.customer_uuid
        left join public.mphone_customer_profiles p on p.customer_uuid=c.customer_uuid
        left join public.mphone_customer_external_refs r on r.customer_uuid=c.customer_uuid
          and r.provider='odoo' and r.sync_status='active'
        left join lateral (select o.status, o.last_error_code from public.mphone_integration_outbox o
          where o.customer_uuid=c.customer_uuid and o.provider='odoo'
          order by o.created_at desc limit 1) latest_outbox on true
        left join lateral (select s.* from public.mphone_subscriptions s where s.customer_uuid=c.customer_uuid
          order by case s.status when 'active' then 0 when 'pending_payment' then 1 else 2 end,
            s.updated_at desc limit 1) subscription on true
        group by c.customer_uuid, p.customer_uuid, r.external_ref_uuid,
          latest_outbox.status, latest_outbox.last_error_code, subscription.subscription_uuid,
          subscription.display_name, subscription.billing_cycle, subscription.billable_quantity,
          subscription.total_amount, subscription.currency, subscription.status,
          subscription.period_end order by c.display_name, c.created_at`
      const tenants = await db`select ct.customer_uuid::text, t.tenant_uuid::text,
        t.tenant_key, t.tenant_type, t.fusion_domain_uuid::text, ct.status
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
        where ct.status<>'removed' and t.enabled=true order by t.tenant_key`
      const domainUuids = [...new Set(tenants.map((row) => row.fusion_domain_uuid))]
      const domains = domainUuids.length === 0 ? [] : await fusion`select domain_uuid::text, domain_name
        from v_domains where domain_uuid=any(${domainUuids}::uuid[])`
      const domainMap = new Map(domains.map((row) => [row.domain_uuid, row.domain_name]))
      const tenantRows = tenants.map((row) => ({ ...row, domain_name: domainMap.get(row.fusion_domain_uuid) ?? '' }))
      const availableTenants = await db`select tenant_uuid::text, tenant_key, tenant_type,
        fusion_domain_uuid::text from public.mphone_login_tenants where enabled=true order by tenant_key`
      return json({ customers: customers.map((customer) => ({ ...customer,
        sync_status: customer.external_sync_status === 'active' ? 'linked'
          : ['failed', 'dead_letter'].includes(customer.outbox_status) ? 'error'
          : ['pending', 'processing'].includes(customer.outbox_status) ? 'pending' : 'unlinked',
        odoo_url: customer.external_id ? `https://user.mphone.vn/odoo/contacts/${customer.external_id}` : null,
        tenants: tenantRows.filter((tenant) => tenant.customer_uuid === customer.customer_uuid) })),
        available_tenants: availableTenants.map((tenant) => ({ ...tenant,
          domain_name: domainMap.get(tenant.fusion_domain_uuid) ?? '' })) })
    }
    if (action === 'customer_manage_detail') {
      const customerUuid = body.customer_uuid
      if (!isUuid(customerUuid)) return json({ error: 'invalid_request' }, 400)
      const customers = await db`select c.customer_uuid::text, c.customer_code, c.display_name,
        c.customer_type, c.status, c.origin_system, c.created_at::text, c.updated_at::text,
        p.legal_name, p.contact_email, p.phone, p.street, p.street2, p.city, p.postal_code,
        p.country_code, p.tax_id, p.website, p.source_updated_at::text as profile_source_updated_at,
        r.external_id, r.last_synced_at::text, r.sync_status as external_sync_status
        from public.mphone_customers c
        left join public.mphone_customer_profiles p on p.customer_uuid=c.customer_uuid
        left join public.mphone_customer_external_refs r on r.customer_uuid=c.customer_uuid
          and r.provider='odoo' and r.sync_status='active'
        where c.customer_uuid=${customerUuid}::uuid limit 1`
      if (customers.length !== 1) return json({ error: 'not_found' }, 404)
      const memberships = await db`select m.membership_uuid::text, m.identity_uuid::text,
        i.primary_email, i.legacy_fusion_user_uuid::text as fusion_user_uuid,
        m.role, m.status, m.created_at::text, m.updated_at::text
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=${customerUuid}::uuid order by m.status, i.primary_email`
      const fusionUserUuids = memberships.map((row) => row.fusion_user_uuid).filter(isUuid)
      const users = fusionUserUuids.length === 0 ? [] : await fusion`select user_uuid::text, username,
        user_enabled::text from v_users where user_uuid=any(${fusionUserUuids}::uuid[])`
      const userMap = new Map(users.map((row) => [row.user_uuid, row]))
      const ownership = await db`select extension_uuid::text, fusion_domain_uuid::text, status,
        created_at::text, updated_at::text from public.mphone_customer_extensions
        where customer_uuid=${customerUuid}::uuid order by status, created_at`
      const extensionUuids = ownership.map((row) => row.extension_uuid)
      const extensions = extensionUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        extension, effective_caller_id_name as display_name, enabled::text from v_extensions
        where extension_uuid=any(${extensionUuids}::uuid[]) order by extension`
      const extensionMap = new Map(extensions.map((row) => [row.extension_uuid, row]))
      const tenants = await db`select ct.customer_tenant_uuid::text, ct.status,
        t.tenant_uuid::text, t.tenant_key, t.tenant_type, t.fusion_domain_uuid::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
        where ct.customer_uuid=${customerUuid}::uuid order by ct.created_at`
      const events = await db`select event_uuid::text, operator_user_uuid::text, action, result,
        target_type, target_uuid::text, details, created_at::text
        from public.mphone_customer_admin_events where target_uuid=${customerUuid}::uuid
          or details->>'customer_uuid'=${customerUuid}
          or details->>'source_customer_uuid'=${customerUuid} order by created_at desc limit 100`
      const outbox = await db`select outbox_uuid::text, event_type, status, attempts,
        last_error_code, created_at::text, processed_at::text, updated_at::text
        from public.mphone_integration_outbox where customer_uuid=${customerUuid}::uuid and provider='odoo'
        order by created_at desc limit 20`
      const profileChangeRequests = await db`select r.request_uuid::text, r.request_type,
        r.old_values, r.new_values, r.changed_fields, r.status, r.review_note,
        r.requested_by_identity_uuid::text, i.primary_email as requested_by_email,
        r.reviewed_by_user_uuid::text, r.outbox_uuid::text, r.submitted_at::text,
        r.reviewed_at::text, r.completed_at::text, r.updated_at::text,
        o.status as outbox_status, o.last_error_code as outbox_error
        from public.mphone_customer_profile_change_requests r
        join public.mphone_identities i on i.identity_uuid=r.requested_by_identity_uuid
        left join public.mphone_integration_outbox o on o.outbox_uuid=r.outbox_uuid
        where r.customer_uuid=${customerUuid}::uuid order by r.created_at desc limit 50`
      const customer = customers[0]
      const subscriptions = await db`select s.subscription_uuid::text, s.display_name, s.billing_cycle,
        s.assigned_extension_count, s.billable_quantity, s.period_start::text, s.period_end::text,
        s.next_renewal_date::text, s.unit_monthly_price, s.discount_percent, s.vat_rate,
        s.untaxed_amount, s.vat_amount, s.total_amount, s.currency, s.status,
        p.code as plan_code, p.display_name as plan_name
        from public.mphone_subscriptions s join public.mphone_service_plans p on p.plan_uuid=s.plan_uuid
        where s.customer_uuid=${customerUuid}::uuid order by s.period_start desc, s.created_at desc`
      const tenantDomainUuids = tenants.filter((row) => row.status === 'active').map((row) => row.fusion_domain_uuid)
      const candidateExtensions = tenantDomainUuids.length === 0 ? [] : await fusion`
        select extension_uuid::text, domain_uuid::text, extension,
          effective_caller_id_name as display_name, enabled::text
        from v_extensions where domain_uuid=any(${tenantDomainUuids}::uuid[])
          and enabled::text='true' order by extension`
      const candidateUuids = candidateExtensions.map((row) => row.extension_uuid)
      const candidateOwners = candidateUuids.length === 0 ? [] : await db`
        select ce.extension_uuid::text, ce.customer_uuid::text, c.display_name as owner_name
        from public.mphone_customer_extensions ce join public.mphone_customers c on c.customer_uuid=ce.customer_uuid
        where ce.extension_uuid=any(${candidateUuids}::uuid[]) and ce.status='active'`
      const candidateOwnerMap = new Map(candidateOwners.map((row) => [row.extension_uuid, row]))
      const syncStatus = customer.external_sync_status === 'active' ? 'linked'
        : ['failed', 'dead_letter'].includes(outbox[0]?.status) ? 'error'
        : ['pending', 'processing'].includes(outbox[0]?.status) ? 'pending' : 'unlinked'
      return json({ customer: { ...customer, sync_status: syncStatus,
          odoo_url: customer.external_id ? `https://user.mphone.vn/odoo/contacts/${customer.external_id}` : null }, tenants,
        memberships: memberships.map((row) => ({ ...row, username: userMap.get(row.fusion_user_uuid)?.username ?? '',
          fusion_enabled: userMap.get(row.fusion_user_uuid)?.user_enabled === 'true' })),
        extensions: ownership.map((row) => ({ ...row, ...(extensionMap.get(row.extension_uuid) ?? {}) })),
        extension_candidates: candidateExtensions.map((row) => ({ ...row,
          owner_customer_uuid: candidateOwnerMap.get(row.extension_uuid)?.customer_uuid ?? null,
          owner_name: candidateOwnerMap.get(row.extension_uuid)?.owner_name ?? null })),
        subscriptions, events, outbox, profile_change_requests: profileChangeRequests })
    }
    if (action === 'customer_profile_change_retry') {
      const requestUuid = body.request_uuid
      if (!isUuid(requestUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db.begin(async (transaction) => {
        const requests = await transaction`select customer_uuid::text, outbox_uuid::text
          from public.mphone_customer_profile_change_requests where request_uuid=${requestUuid}::uuid
            and status='failed' for update`
        if (requests.length !== 1 || !isUuid(requests[0].outbox_uuid)) return []
        const outbox = await transaction`update public.mphone_integration_outbox set status='pending',
          attempts=0, next_retry_at=now(), last_error_code=null, updated_at=now()
          where outbox_uuid=${requests[0].outbox_uuid}::uuid and status in ('failed','dead_letter')
          returning outbox_uuid::text`
        if (outbox.length !== 1) return []
        await transaction`update public.mphone_customer_profile_change_requests set status='syncing',
          updated_at=now() where request_uuid=${requestUuid}::uuid`
        return requests
      })
      if (rows.length !== 1) return json({ error: 'invalid_request_status' }, 409)
      await audit('accepted', 'profile_change_request', requestUuid, {
        customer_uuid: rows[0].customer_uuid, decision: 'retry', outbox_uuid: rows[0].outbox_uuid,
      })
      return json({ queued: true, status: 'syncing' })
    }
    if (action === 'customer_profile_change_approve' || action === 'customer_profile_change_reject') {
      const requestUuid = body.request_uuid
      if (!isUuid(requestUuid)) return json({ error: 'invalid_request' }, 400)
      const reviewNote = typeof body.review_note === 'string' ? body.review_note.trim() : ''
      if (reviewNote.length > 1000 || (action === 'customer_profile_change_reject' && reviewNote.length < 2)) {
        return json({ error: 'review_note_required' }, 400)
      }
      const outcome = await db.begin(async (transaction) => {
        const requests = await transaction`select r.request_uuid::text, r.customer_uuid::text,
          r.old_values, r.new_values, r.changed_fields, r.status,
          p.legal_name, p.contact_email, p.phone, p.street, p.street2, p.city,
          p.postal_code, p.country_code, p.tax_id
          from public.mphone_customer_profile_change_requests r
          left join public.mphone_customer_profiles p on p.customer_uuid=r.customer_uuid
          where r.request_uuid=${requestUuid}::uuid for update of r`
        if (requests.length !== 1) return { result: 'not_found' }
        const request = requests[0]
        if (!['submitted', 'under_review'].includes(request.status)) return { result: 'invalid_status' }
        if (action === 'customer_profile_change_reject') {
          await transaction`update public.mphone_customer_profile_change_requests set status='rejected',
            reviewed_by_user_uuid=${operatorUserUuid}::uuid, review_note=${reviewNote},
            reviewed_at=now(), updated_at=now() where request_uuid=${requestUuid}::uuid`
          return { result: 'rejected', customerUuid: request.customer_uuid }
        }
        const currentValues: Record<string, unknown> = {
          legal_name: request.legal_name ?? null, contact_email: request.contact_email ?? null,
          phone: request.phone ?? null, street: request.street ?? null, street2: request.street2 ?? null,
          city: request.city ?? null, postal_code: request.postal_code ?? null,
          country_code: request.country_code ?? null, tax_id: request.tax_id ?? null,
        }
        const oldValues = request.old_values as Record<string, unknown>
        if (Object.keys(currentValues).some((key) => currentValues[key] !== (oldValues[key] ?? null))) {
          return { result: 'profile_conflict' }
        }
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider, event_type, customer_uuid, payload) values
          ('odoo', 'customer.legal_profile_change.approved', ${request.customer_uuid}::uuid,
            ${transaction.json({ customer_uuid: request.customer_uuid, request_uuid: requestUuid,
              changed_fields: request.changed_fields, legal_profile: request.new_values })})
          returning outbox_uuid::text`
        await transaction`update public.mphone_customer_profile_change_requests set status='syncing',
          reviewed_by_user_uuid=${operatorUserUuid}::uuid, review_note=${reviewNote || null},
          reviewed_at=now(), outbox_uuid=${outbox[0].outbox_uuid}::uuid, updated_at=now()
          where request_uuid=${requestUuid}::uuid`
        return { result: 'approved', customerUuid: request.customer_uuid, outboxUuid: outbox[0].outbox_uuid }
      })
      if (outcome.result === 'not_found') return json({ error: 'not_found' }, 404)
      if (outcome.result === 'invalid_status') return json({ error: 'invalid_request_status' }, 409)
      if (outcome.result === 'profile_conflict') return json({ error: 'legal_profile_conflict' }, 409)
      await audit('accepted', 'profile_change_request', requestUuid, {
        customer_uuid: outcome.customerUuid, decision: outcome.result,
        outbox_uuid: outcome.outboxUuid, review_note_present: reviewNote !== '',
      })
      return json({ saved: true, status: outcome.result === 'approved' ? 'syncing' : 'rejected' })
    }
    if (action === 'customer_manage_extension_transfer') {
      const targetCustomerUuid = body.customer_uuid
      const extensionUuid = body.extension_uuid
      if (!isUuid(targetCustomerUuid) || !isUuid(extensionUuid)) return json({ error: 'invalid_request' }, 400)
      const targetContexts = await db`select t.tenant_uuid::text,t.fusion_domain_uuid::text
        from public.mphone_customers c
        join public.mphone_customer_tenants ct on ct.customer_uuid=c.customer_uuid and ct.status='active'
        join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where c.customer_uuid=${targetCustomerUuid}::uuid and c.status<>'closed'`
      const targetDomains = targetContexts.map((row) => row.fusion_domain_uuid)
      const extension = targetDomains.length === 0 ? [] : await fusion`
        select extension_uuid::text,domain_uuid::text from v_extensions
        where extension_uuid=${extensionUuid}::uuid and domain_uuid=any(${targetDomains}::uuid[])
          and enabled::text='true' limit 1`
      if (extension.length !== 1) return json({ error: 'extension_outside_customer_tenant' }, 403)
      const targetContext = targetContexts.find((row) => row.fusion_domain_uuid === extension[0].domain_uuid)
      if (!targetContext) return json({ error: 'extension_outside_customer_tenant' }, 403)
      const current = await db`select ce.customer_uuid::text,c.display_name
        from public.mphone_customer_extensions ce join public.mphone_customers c on c.customer_uuid=ce.customer_uuid
        where ce.extension_uuid=${extensionUuid}::uuid and ce.status='active' limit 1`
      const sourceCustomerUuid = current[0]?.customer_uuid ?? null
      if (sourceCustomerUuid === targetCustomerUuid) return json({ assigned: true, unchanged: true })
      if (sourceCustomerUuid && body.confirm_transfer !== true) {
        return json({ error: 'transfer_confirmation_required', owner_name: current[0].display_name }, 409)
      }
      if (sourceCustomerUuid && body.source_customer_uuid !== sourceCustomerUuid) {
        return json({ error: 'extension_owner_changed', owner_name: current[0].display_name }, 409)
      }
      const affected = sourceCustomerUuid ? await db`select distinct identity_uuid::text
        from public.mphone_extension_assignments where customer_uuid=${sourceCustomerUuid}::uuid
          and extension_uuid=${extensionUuid}::uuid and status='active'` : []
      await db.begin(async (transaction) => {
        if (sourceCustomerUuid) await transaction`update public.mphone_extension_assignments
          set status='removed',can_use=false,can_manage=false,updated_at=now()
          where customer_uuid=${sourceCustomerUuid}::uuid and extension_uuid=${extensionUuid}::uuid
            and status='active'`
        await transaction`insert into public.mphone_customer_extensions
          (customer_uuid,tenant_uuid,fusion_domain_uuid,extension_uuid,status,updated_at)
          values(${targetCustomerUuid}::uuid,${targetContext.tenant_uuid}::uuid,
            ${targetContext.fusion_domain_uuid}::uuid,${extensionUuid}::uuid,'active',now())
          on conflict(extension_uuid) do update set customer_uuid=excluded.customer_uuid,
            tenant_uuid=excluded.tenant_uuid,fusion_domain_uuid=excluded.fusion_domain_uuid,
            status='active',updated_at=now()`
        if (affected.length > 0) await transaction`update public.mphone_device_sessions
          set revoked_at=coalesce(revoked_at,now()),revoke_reason='extension_ownership_transferred'
          where identity_uuid=any(${affected.map((row) => row.identity_uuid)}::uuid[]) and revoked_at is null`
      })
      await audit('accepted','extension',extensionUuid,{ customer_uuid: targetCustomerUuid,
        source_customer_uuid: sourceCustomerUuid,ownership: sourceCustomerUuid ? 'transferred' : 'claimed',
        revoked_assignments: affected.length })
      return json({ assigned: true, transferred: sourceCustomerUuid !== null,
        revoked_assignments: affected.length })
    }
    if (action === 'customer_manage_create') {
      const displayName = typeof body.display_name === 'string' ? body.display_name.trim() : ''
      const customerType = typeof body.customer_type === 'string' ? body.customer_type : ''
      const tenantUuid = body.tenant_uuid
      if (displayName.length < 2 || displayName.length > 120 ||
        !['individual', 'organization'].includes(customerType) || !isUuid(tenantUuid)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const tenants = await db`select tenant_uuid::text from public.mphone_login_tenants
        where tenant_uuid=${tenantUuid}::uuid and enabled=true limit 1`
      if (tenants.length !== 1) return json({ error: 'tenant_not_found' }, 404)
      const customerCode = `CUS-${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`
      const rows = await db.begin(async (transaction) => {
        const created = await transaction`insert into public.mphone_customers
          (customer_code, display_name, customer_type, status, origin_system, updated_at)
          values (${customerCode}, ${displayName}, ${customerType}, 'active', 'portal', now())
          returning customer_uuid::text, customer_code, display_name, customer_type, status`
        await transaction`insert into public.mphone_customer_tenants
          (customer_uuid, tenant_uuid, status, updated_at)
          values (${created[0].customer_uuid}::uuid, ${tenantUuid}::uuid, 'active', now())`
        await transaction`insert into public.mphone_integration_outbox
          (provider, event_type, customer_uuid, payload)
          values ('odoo', 'customer.created', ${created[0].customer_uuid}::uuid,
            ${transaction.json({ customer_uuid: created[0].customer_uuid,
              customer_code: created[0].customer_code, display_name: created[0].display_name,
              customer_type: customerType, origin_system: 'portal' })})`
        return created
      })
      await audit('accepted', 'customer', rows[0].customer_uuid,
        { customer_uuid: rows[0].customer_uuid, created: true, customer_type: customerType })
      return json({ created: true, customer: rows[0] })
    }
    if (action === 'customer_manage_update') {
      const customerUuid = body.customer_uuid
      const displayName = typeof body.display_name === 'string' ? body.display_name.trim() : ''
      const customerType = typeof body.customer_type === 'string' ? body.customer_type : ''
      if (!isUuid(customerUuid) || displayName.length < 2 || displayName.length > 120 ||
        !['individual', 'organization'].includes(customerType)) return json({ error: 'invalid_request' }, 400)
      const linked = await db`select 1 from public.mphone_customer_external_refs
        where customer_uuid=${customerUuid}::uuid and provider='odoo' and sync_status='active' limit 1`
      if (linked.length > 0) return json({ error: 'odoo_profile_read_only' }, 409)
      const rows = await db`update public.mphone_customers set display_name=${displayName},
        customer_type=${customerType}, updated_at=now() where customer_uuid=${customerUuid}::uuid
        returning customer_uuid::text, display_name, customer_type, status`
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      await audit('accepted', 'customer', customerUuid,
        { customer_uuid: customerUuid, updated: true, display_name: displayName, customer_type: customerType })
      return json({ saved: true, customer: rows[0] })
    }
    if (action === 'customer_manage_sync_retry') {
      const customerUuid = body.customer_uuid
      if (!isUuid(customerUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db.begin(async (transaction) => {
        const customers = await transaction`select customer_uuid::text, customer_code, display_name,
          customer_type, origin_system from public.mphone_customers
          where customer_uuid=${customerUuid}::uuid and status<>'closed' limit 1`
        if (customers.length !== 1) return []
        const pending = await transaction`select outbox_uuid::text from public.mphone_integration_outbox
          where customer_uuid=${customerUuid}::uuid and provider='odoo' and status in ('pending', 'processing') limit 1`
        if (pending.length > 0) return pending
        const failed = await transaction`update public.mphone_integration_outbox
          set status='pending', attempts=0, next_retry_at=now(), last_error_code=null, updated_at=now()
          where outbox_uuid=(select outbox_uuid from public.mphone_integration_outbox
            where customer_uuid=${customerUuid}::uuid and provider='odoo' and status in ('failed', 'dead_letter')
            order by created_at desc limit 1) returning outbox_uuid::text`
        if (failed.length > 0) return failed
        return await transaction`insert into public.mphone_integration_outbox
          (provider, event_type, customer_uuid, payload) values
          ('odoo', 'customer.created', ${customerUuid}::uuid, ${transaction.json(customers[0])})
          returning outbox_uuid::text`
      })
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      await audit('accepted', 'customer', customerUuid, { customer_uuid: customerUuid, sync_retry: true })
      return json({ queued: true, outbox_uuid: rows[0].outbox_uuid })
    }
    if (action === 'customer_manage_status') {
      const customerUuid = body.customer_uuid
      const status = typeof body.status === 'string' ? body.status : ''
      if (!isUuid(customerUuid) || !['pending', 'active', 'suspended', 'closed'].includes(status)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const rows = await db.begin(async (transaction) => {
        const updated = await transaction`update public.mphone_customers set status=${status}, updated_at=now()
          where customer_uuid=${customerUuid}::uuid returning customer_uuid::text, status`
        if (updated.length !== 1) return updated
        if (status === 'suspended' || status === 'closed') await transaction`update public.mphone_device_sessions
          set revoked_at=coalesce(revoked_at, now()), revoke_reason=${status === 'closed' ? 'customer_closed' : 'customer_suspended'}
          where customer_uuid=${customerUuid}::uuid and revoked_at is null`
        return updated
      })
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      await audit('accepted', 'customer', customerUuid, { customer_uuid: customerUuid, status })
      return json({ saved: true, status })
    }
    const mergePreview = async (targetCustomerUuid: string, sourceCustomerUuids: string[], selectedIdentityUuids: string[] = []) => {
      const allCustomerUuids = [targetCustomerUuid, ...sourceCustomerUuids]
      const customers = await db`select customer_uuid::text, customer_code, display_name, customer_type,
        status, updated_at::text from public.mphone_customers
        where customer_uuid=any(${allCustomerUuids}::uuid[]) order by customer_uuid`
      const tenants = await db`select ct.customer_uuid::text, ct.tenant_uuid::text,
        t.fusion_domain_uuid::text, ct.status, ct.updated_at::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
        where ct.customer_uuid=any(${allCustomerUuids}::uuid[]) and ct.status='active' and t.enabled=true
        order by ct.customer_uuid, ct.tenant_uuid`
      const allSourceMemberships = await db`select m.membership_uuid::text, m.customer_uuid::text,
        m.identity_uuid::text, i.primary_email, i.legacy_fusion_user_uuid::text as fusion_user_uuid,
        m.role, m.status, m.updated_at::text
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=any(${sourceCustomerUuids}::uuid[]) and m.status<>'removed'
        order by m.customer_uuid, m.identity_uuid`
      const memberships = selectedIdentityUuids.length === 0 ? allSourceMemberships
        : allSourceMemberships.filter((row) => selectedIdentityUuids.includes(row.identity_uuid))
      const allOwnership = await db`select customer_extension_uuid::text, customer_uuid::text,
        tenant_uuid::text, fusion_domain_uuid::text, extension_uuid::text, updated_at::text
        from public.mphone_customer_extensions where customer_uuid=any(${sourceCustomerUuids}::uuid[])
          and status='active' order by customer_uuid, extension_uuid`
      const allAssignments = await db`select assignment_uuid::text, customer_uuid::text,
        identity_uuid::text, tenant_uuid::text, fusion_domain_uuid::text, extension_uuid::text,
        can_use, can_manage, updated_at::text from public.mphone_extension_assignments
        where customer_uuid=any(${sourceCustomerUuids}::uuid[]) and status='active'
        order by customer_uuid, identity_uuid, extension_uuid`
      const assignments = selectedIdentityUuids.length === 0 ? allAssignments
        : allAssignments.filter((row) => selectedIdentityUuids.includes(row.identity_uuid))
      const selectedExtensionSet = new Set(assignments.map((row) => row.extension_uuid))
      const ownership = selectedIdentityUuids.length === 0 ? allOwnership
        : allOwnership.filter((row) => selectedExtensionSet.has(row.extension_uuid))
      const errors: Array<Record<string, unknown>> = []
      if (selectedIdentityUuids.length > 0 && memberships.length !== selectedIdentityUuids.length) {
        errors.push({ code: 'selected_membership_unavailable' })
      }
      if (customers.length !== allCustomerUuids.length) errors.push({ code: 'customer_not_found' })
      for (const customer of customers) {
        if (customer.status !== 'active') errors.push({ code: 'customer_not_active', customer_uuid: customer.customer_uuid })
      }
      const targetTenants = tenants.filter((row) => row.customer_uuid === targetCustomerUuid)
      if (targetTenants.length !== 1) errors.push({ code: 'target_tenant_ambiguous' })
      const targetTenant = targetTenants[0]
      for (const sourceCustomerUuid of sourceCustomerUuids) {
        const sourceTenants = tenants.filter((row) => row.customer_uuid === sourceCustomerUuid)
        if (sourceTenants.length !== 1 || !targetTenant || sourceTenants[0].tenant_uuid !== targetTenant.tenant_uuid ||
          sourceTenants[0].fusion_domain_uuid !== targetTenant.fusion_domain_uuid) {
          errors.push({ code: 'tenant_mismatch', customer_uuid: sourceCustomerUuid })
        }
      }
      const fusionUserUuids = memberships.map((row) => row.fusion_user_uuid).filter(isUuid)
      const activeFusionUsers = fusionUserUuids.length === 0 ? [] : await fusion`select user_uuid::text
        from v_users where user_uuid=any(${fusionUserUuids}::uuid[]) and user_enabled::text='true'`
      const activeFusionSet = new Set(activeFusionUsers.map((row) => row.user_uuid))
      for (const membership of memberships) {
        if (!isUuid(membership.fusion_user_uuid) || !activeFusionSet.has(membership.fusion_user_uuid)) {
          errors.push({ code: 'fusion_user_unavailable', identity_uuid: membership.identity_uuid })
        }
      }
      if (selectedIdentityUuids.length > 0) {
        const selectedSet = new Set(selectedIdentityUuids)
        for (const assignment of allAssignments) {
          if (selectedExtensionSet.has(assignment.extension_uuid) && !selectedSet.has(assignment.identity_uuid)) {
            errors.push({ code: 'shared_extension_requires_all_users', extension_uuid: assignment.extension_uuid })
          }
        }
        for (const sourceCustomerUuid of sourceCustomerUuids) {
          const remaining = allSourceMemberships.filter((row) => row.customer_uuid === sourceCustomerUuid && !selectedSet.has(row.identity_uuid))
          if (remaining.length > 0 && !remaining.some((row) => row.role === 'owner' && row.status === 'active')) {
            errors.push({ code: 'source_owner_required', customer_uuid: sourceCustomerUuid })
          }
        }
      }
      const extensionUuids = ownership.map((row) => row.extension_uuid)
      const fusionExtensions = extensionUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        extension, effective_caller_id_name as display_name from v_extensions
        where extension_uuid=any(${extensionUuids}::uuid[]) and enabled::text='true'
          and domain_uuid=${targetTenant?.fusion_domain_uuid ?? null}::uuid order by extension`
      const extensionMap = new Map(fusionExtensions.map((row) => [row.extension_uuid, row]))
      for (const owner of ownership) {
        if (!extensionMap.has(owner.extension_uuid)) errors.push({ code: 'extension_unavailable', extension_uuid: owner.extension_uuid })
      }
      const destinationMemberships = memberships.length === 0 ? [] : await db`select identity_uuid::text,
        role, status from public.mphone_memberships where customer_uuid=${targetCustomerUuid}::uuid
          and identity_uuid=any(${memberships.map((row) => row.identity_uuid)}::uuid[])`
      const targetOwners = await db`select membership_uuid::text, identity_uuid::text, updated_at::text
        from public.mphone_memberships where customer_uuid=${targetCustomerUuid}::uuid
          and role='owner' and status='active' order by membership_uuid`
      if (targetOwners.length === 0) errors.push({ code: 'target_owner_required' })
      const snapshot = { customers, tenants, memberships, ownership, assignments, destinationMemberships,
        targetOwners, selectedIdentityUuids }
      const digest = await sha256(JSON.stringify(snapshot))
      return {
        valid: errors.length === 0,
        errors,
        digest,
        snapshot,
        summary: {
          source_customers: sourceCustomerUuids.length,
          memberships: memberships.length,
          extensions: ownership.length,
          assignments: assignments.length,
          existing_destination_memberships: destinationMemberships.length,
        },
        target: customers.find((row) => row.customer_uuid === targetCustomerUuid) ?? null,
        sources: customers.filter((row) => sourceCustomerUuids.includes(row.customer_uuid)),
        members: memberships.map((row) => ({ ...row, target_role: row.role === 'owner' ? 'member' : row.role })),
        extensions: ownership.map((row) => ({ ...row, ...(extensionMap.get(row.extension_uuid) ?? {}) })),
      }
    }

    if (action === 'customer_merge_preview') {
      if (body.actor_superadmin !== true) return json({ error: 'forbidden' }, 403)
      const targetCustomerUuid = body.target_customer_uuid
      const sourceCustomerUuids = Array.isArray(body.source_customer_uuids)
        ? [...new Set(body.source_customer_uuids.filter(isUuid))].slice(0, 50) : []
      const selectedIdentityUuids = Array.isArray(body.selected_identity_uuids)
        ? [...new Set(body.selected_identity_uuids.filter(isUuid))].slice(0, 200) : []
      if (!isUuid(targetCustomerUuid) || sourceCustomerUuids.length === 0 || sourceCustomerUuids.includes(targetCustomerUuid)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const preview = await mergePreview(targetCustomerUuid, sourceCustomerUuids, selectedIdentityUuids)
      const operationUuid = crypto.randomUUID()
      await db`insert into public.mphone_customer_merge_operations
        (operation_uuid, operator_user_uuid, operator_domain_uuid, target_customer_uuid,
          source_customer_uuids, status, preview_digest, snapshot)
        values (${operationUuid}::uuid, ${operatorUserUuid}::uuid, ${operatorDomainUuid}::uuid,
          ${targetCustomerUuid}::uuid, ${sourceCustomerUuids}::uuid[], 'previewed',
          ${preview.digest}, ${db.json(preview.snapshot)})`
      await audit(preview.valid ? 'accepted' : 'rejected', 'customer_merge', operationUuid,
        { target_customer_uuid: targetCustomerUuid, source_customer_uuids: sourceCustomerUuids,
          preview: true, errors: preview.errors })
      return json({ operation_uuid: operationUuid, ...preview })
    }

    if (action === 'customer_merge_execute') {
      if (body.actor_superadmin !== true) return json({ error: 'forbidden' }, 403)
      const operationUuid = body.operation_uuid
      if (!isUuid(operationUuid)) return json({ error: 'invalid_request' }, 400)
      const operations = await db`select operation_uuid::text, operator_user_uuid::text,
        target_customer_uuid::text, source_customer_uuids::text[], status, preview_digest, snapshot
        from public.mphone_customer_merge_operations where operation_uuid=${operationUuid}::uuid limit 1`
      const operation = operations[0]
      if (!operation || operation.operator_user_uuid !== operatorUserUuid) return json({ error: 'not_found' }, 404)
      if (operation.status === 'completed') return json({ error: 'already_completed' }, 409)
      if (operation.status !== 'previewed') return json({ error: 'operation_unavailable' }, 409)
      const selectedIdentityUuids = Array.isArray(operation.snapshot?.selectedIdentityUuids)
        ? operation.snapshot.selectedIdentityUuids.filter(isUuid) : []
      const preview = await mergePreview(operation.target_customer_uuid, operation.source_customer_uuids, selectedIdentityUuids)
      if (!preview.valid) return json({ error: 'merge_conflict', conflicts: preview.errors }, 409)
      if (preview.digest !== operation.preview_digest) return json({ error: 'preview_stale' }, 409)
      const targetCustomerUuid = operation.target_customer_uuid
      const sourceCustomerUuids = operation.source_customer_uuids
      const targetTenant = preview.snapshot.tenants.find((row: Record<string, unknown>) => row.customer_uuid === targetCustomerUuid)
      const identityUuids = preview.snapshot.memberships.map((row: Record<string, unknown>) => row.identity_uuid)
      const extensionUuids = preview.snapshot.ownership.map((row: Record<string, unknown>) => row.extension_uuid)
      await db.begin(async (transaction) => {
        const locked = await transaction`select status from public.mphone_customer_merge_operations
          where operation_uuid=${operationUuid}::uuid for update`
        if (locked[0]?.status !== 'previewed') throw new Error('operation_unavailable')
        await transaction`update public.mphone_customer_merge_operations set status='running', updated_at=now()
          where operation_uuid=${operationUuid}::uuid`
        await transaction`insert into public.mphone_memberships
          (customer_uuid, identity_uuid, role, status, updated_at)
          select ${targetCustomerUuid}::uuid, identity_uuid,
            case when role='owner' then 'member' else role end, status, now()
          from public.mphone_memberships where customer_uuid=any(${sourceCustomerUuids}::uuid[])
            and identity_uuid=any(${identityUuids}::uuid[]) and status<>'removed'
          on conflict (customer_uuid, identity_uuid) do update set
            status=case when public.mphone_memberships.status='active' then 'active' else excluded.status end,
            updated_at=now()`
        await transaction`insert into public.mphone_extension_assignments
          (customer_uuid, identity_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid,
            can_use, can_manage, status, updated_at)
          select ${targetCustomerUuid}::uuid, identity_uuid, ${targetTenant.tenant_uuid}::uuid,
            ${targetTenant.fusion_domain_uuid}::uuid, extension_uuid, can_use, can_manage, 'active', now()
          from public.mphone_extension_assignments where customer_uuid=any(${sourceCustomerUuids}::uuid[])
            and identity_uuid=any(${identityUuids}::uuid[]) and status='active'
          on conflict (customer_uuid, identity_uuid, extension_uuid) do update set
            can_use=public.mphone_extension_assignments.can_use or excluded.can_use,
            can_manage=public.mphone_extension_assignments.can_manage or excluded.can_manage,
            status='active', updated_at=now()`
        await transaction`update public.mphone_customer_extensions set customer_uuid=${targetCustomerUuid}::uuid,
          tenant_uuid=${targetTenant.tenant_uuid}::uuid, fusion_domain_uuid=${targetTenant.fusion_domain_uuid}::uuid,
          updated_at=now() where customer_uuid=any(${sourceCustomerUuids}::uuid[])
            and extension_uuid=any(${extensionUuids}::uuid[]) and status='active'`
        await transaction`update public.mphone_extension_assignments set status='removed', can_use=false,
          can_manage=false, updated_at=now() where customer_uuid=any(${sourceCustomerUuids}::uuid[])
            and identity_uuid=any(${identityUuids}::uuid[]) and status='active'`
        await transaction`update public.mphone_memberships set status='removed', updated_at=now()
          where customer_uuid=any(${sourceCustomerUuids}::uuid[])
            and identity_uuid=any(${identityUuids}::uuid[]) and status<>'removed'`
        await transaction`update public.mphone_customer_tenants set status='removed', updated_at=now()
          where customer_uuid in (select c.customer_uuid from public.mphone_customers c
            where c.customer_uuid=any(${sourceCustomerUuids}::uuid[]) and not exists
              (select 1 from public.mphone_memberships m where m.customer_uuid=c.customer_uuid and m.status<>'removed')
              and not exists (select 1 from public.mphone_customer_extensions ce
                where ce.customer_uuid=c.customer_uuid and ce.status='active')) and status='active'`
        await transaction`update public.mphone_customers set status='closed', updated_at=now()
          where customer_uuid=any(${sourceCustomerUuids}::uuid[]) and not exists
            (select 1 from public.mphone_memberships m where m.customer_uuid=public.mphone_customers.customer_uuid
              and m.status<>'removed') and not exists (select 1 from public.mphone_customer_extensions ce
              where ce.customer_uuid=public.mphone_customers.customer_uuid and ce.status='active')`
        if (identityUuids.length > 0) await transaction`update public.mphone_device_sessions
          set revoked_at=coalesce(revoked_at, now()), revoke_reason='customer_merged'
          where identity_uuid=any(${identityUuids}::uuid[]) and revoked_at is null`
        await transaction`update public.mphone_customer_merge_operations set status='completed',
          result=${transaction.json(preview.summary)}, updated_at=now(), completed_at=now()
          where operation_uuid=${operationUuid}::uuid`
      })
      await audit('accepted', 'customer_merge', operationUuid,
        { target_customer_uuid: targetCustomerUuid, source_customer_uuids: sourceCustomerUuids,
          completed: true, summary: preview.summary })
      return json({ merged: true, operation_uuid: operationUuid, summary: preview.summary })
    }
    if (action === 'portal_customers_list') {
      const isSuperadmin = body.actor_superadmin === true
      if (!isSuperadmin && body.actor_admin !== true) return json({ error: 'forbidden' }, 403)
      const customers = isSuperadmin
        ? await db`select customer_uuid::text, display_name, customer_code, customer_type from public.mphone_customers
            where status='active' order by display_name`
        : await db`select distinct c.customer_uuid::text, c.display_name, c.customer_code, c.customer_type
            from public.mphone_customers c join public.mphone_customer_tenants ct on ct.customer_uuid=c.customer_uuid
            join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
            where c.status='active' and ct.status='active' and t.enabled=true
              and t.fusion_domain_uuid=${operatorDomainUuid}::uuid order by c.display_name`
      const customerUuids = customers.map((row) => row.customer_uuid)
      const memberships = customerUuids.length === 0 ? [] : await db`select m.customer_uuid::text,
        i.legacy_fusion_user_uuid::text as fusion_user_uuid
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=any(${customerUuids}::uuid[]) and m.status<>'removed'`
      const fusionUserUuids = memberships.map((row) => row.fusion_user_uuid).filter(isUuid)
      const liveFusionUsers = fusionUserUuids.length === 0 ? [] : await fusion`select user_uuid::text
        from v_users where user_uuid=any(${fusionUserUuids}::uuid[]) and user_enabled::text='true'`
      const liveFusionSet = new Set(liveFusionUsers.map((row) => row.user_uuid))
      const eligibleCustomerSet = new Set(memberships
        .filter((row) => isUuid(row.fusion_user_uuid) && liveFusionSet.has(row.fusion_user_uuid))
        .map((row) => row.customer_uuid))
      for (const customer of customers) {
        if (customer.customer_type === 'organization') eligibleCustomerSet.add(customer.customer_uuid)
      }
      const emptyCustomerUuids = customerUuids.filter((uuid) => !eligibleCustomerSet.has(uuid))
      if (emptyCustomerUuids.length > 0) {
        const ownership = await db`select distinct customer_uuid::text from public.mphone_customer_extensions
          where customer_uuid=any(${emptyCustomerUuids}::uuid[]) and status='active'`
        const ownedSet = new Set(ownership.map((row) => row.customer_uuid))
        const closableCustomerUuids = emptyCustomerUuids.filter((uuid) => !ownedSet.has(uuid) &&
          customers.find((customer) => customer.customer_uuid === uuid)?.customer_type === 'individual')
        if (closableCustomerUuids.length > 0) {
          await db.begin(async (transaction) => {
            await transaction`update public.mphone_customer_tenants set status='removed', updated_at=now()
              where customer_uuid=any(${closableCustomerUuids}::uuid[]) and status='active'`
            await transaction`update public.mphone_customers set status='closed', updated_at=now()
              where customer_uuid=any(${closableCustomerUuids}::uuid[]) and status='active'`
          })
          await audit('accepted', 'customer', undefined,
            { reconciliation: 'empty_customer_closed', customers: closableCustomerUuids.length })
        }
      }
      return json({ customers: customers.filter((row) => eligibleCustomerSet.has(row.customer_uuid)),
        capabilities: { superadmin: isSuperadmin } })
    }
    if (action === 'portal_users_all') {
      const isSuperadmin = body.actor_superadmin === true
      if (!isSuperadmin && body.actor_admin !== true) return json({ error: 'forbidden' }, 403)
      const memberships = isSuperadmin
        ? await db`select m.membership_uuid::text, m.customer_uuid::text, c.display_name as customer_name,
            c.status as customer_status,
            m.identity_uuid::text, i.primary_email, i.legacy_fusion_user_uuid::text as fusion_user_uuid,
            i.status as identity_status, m.role, m.status
            from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
            join public.mphone_customers c on c.customer_uuid=m.customer_uuid
            where m.status<>'removed' and c.status<>'closed' order by i.primary_email`
        : await db`select distinct m.membership_uuid::text, m.customer_uuid::text, c.display_name as customer_name,
            c.status as customer_status,
            m.identity_uuid::text, i.primary_email, i.legacy_fusion_user_uuid::text as fusion_user_uuid,
            i.status as identity_status, m.role, m.status
            from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
            join public.mphone_customers c on c.customer_uuid=m.customer_uuid
            join public.mphone_customer_tenants ct on ct.customer_uuid=c.customer_uuid and ct.status='active'
            join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
            where m.status<>'removed' and c.status='active'
              and t.fusion_domain_uuid=${operatorDomainUuid}::uuid order by i.primary_email`
      const fusionUserUuids = memberships.map((row) => row.fusion_user_uuid).filter(isUuid)
      const fusionUsers = fusionUserUuids.length === 0 ? [] : await fusion`select user_uuid::text, username
        from v_users where user_uuid=any(${fusionUserUuids}::uuid[])`
      const fusionUserMap = new Map(fusionUsers.map((row) => [row.user_uuid, row.username]))
      const staleIdentityUuids = memberships
        // Identities invited by Odoo intentionally have no Fusion user. Only reconcile
        // identities which were actually linked to Fusion and whose linked user vanished.
        .filter((row) => isUuid(row.fusion_user_uuid) && !fusionUserMap.has(row.fusion_user_uuid))
        .map((row) => row.identity_uuid)
      if (staleIdentityUuids.length > 0) {
        await db.begin(async (transaction) => {
          await transaction`update public.mphone_memberships set status='removed', updated_at=now()
            where identity_uuid=any(${staleIdentityUuids}::uuid[]) and status<>'removed'`
          await transaction`update public.mphone_extension_assignments set status='removed', can_use=false,
            can_manage=false, updated_at=now() where identity_uuid=any(${staleIdentityUuids}::uuid[])
              and status='active'`
          await transaction`update public.mphone_identities i set status='disabled', updated_at=now()
            where i.identity_uuid=any(${staleIdentityUuids}::uuid[]) and not exists
              (select 1 from public.mphone_memberships m where m.identity_uuid=i.identity_uuid
                and m.status in ('active', 'invited', 'suspended'))`
        })
        await audit('accepted', 'identity', undefined,
          { reconciliation: 'fusion_user_removed', identities: staleIdentityUuids.length })
      }
      const activeMemberships = memberships.filter((row) => !staleIdentityUuids.includes(row.identity_uuid))
      const identityUuids = activeMemberships.map((row) => row.identity_uuid)
      const assignments = identityUuids.length === 0 ? [] : await db`select identity_uuid::text,
        customer_uuid::text, extension_uuid::text from public.mphone_extension_assignments
        where identity_uuid=any(${identityUuids}::uuid[]) and status='active'`
      const extensionUuids = [...new Set(assignments.map((row) => row.extension_uuid))]
      const extensions = extensionUuids.length === 0 ? [] : await fusion`select extension_uuid::text, extension
        from v_extensions where extension_uuid=any(${extensionUuids}::uuid[]) and enabled::text='true'`
      // Memberships remain the editable authorization records. The directory
      // adds people who are not represented by a Membership so superadmins get
      // a complete system-wide user view without granting those rows access.
      const directory: Record<string, unknown>[] = []
      if (isSuperadmin) {
        const visibleIdentitySet = new Set(activeMemberships.map((row) => row.identity_uuid))
        const identities = await db`select identity_uuid::text, primary_email,
          legacy_fusion_user_uuid::text as fusion_user_uuid, status as identity_status,
          email_verified_at::text from public.mphone_identities
          where status<>'disabled' order by primary_email`
        const linkedFusionSet = new Set(identities.map((row) => row.fusion_user_uuid).filter(isUuid))
        const identityFusionUuids = identities.map((row) => row.fusion_user_uuid).filter(isUuid)
        const identityFusionUsers = identityFusionUuids.length === 0 ? [] : await fusion`
          select user_uuid::text, username from v_users
          where user_uuid=any(${identityFusionUuids}::uuid[])`
        const identityFusionMap = new Map(identityFusionUsers.map((row) => [row.user_uuid, row.username]))
        for (const identity of identities) {
          if (visibleIdentitySet.has(identity.identity_uuid)) continue
          directory.push({ directory_key: `identity:${identity.identity_uuid}`, directory_type: 'identity',
            identity_uuid: identity.identity_uuid, primary_email: identity.primary_email,
            username: identityFusionMap.get(identity.fusion_user_uuid) ?? '',
            identity_status: identity.identity_status, email_verified_at: identity.email_verified_at })
        }
        const unlinkedFusionUsers = await fusion`select u.user_uuid::text, u.username,
          lower(btrim(u.user_email)) as primary_email
          from v_users u where u.user_enabled::text='true' order by u.username`
        for (const user of unlinkedFusionUsers) {
          if (linkedFusionSet.has(user.user_uuid)) continue
          directory.push({ directory_key: `fusion:${user.user_uuid}`, directory_type: 'fusion',
            fusion_user_uuid: user.user_uuid, primary_email: user.primary_email ?? '',
            username: user.username, identity_status: 'not_linked', email_verified_at: null })
        }
      }
      return json({ memberships: activeMemberships.map((row) => ({ ...row,
        username: fusionUserMap.get(row.fusion_user_uuid) ?? '' })), assignments, extensions,
        directory,
        capabilities: { superadmin: isSuperadmin } })
    }
    const portalActions = ['portal_users_list', 'portal_user_invite', 'portal_user_update', 'portal_user_resend',
      'portal_customer_profile', 'portal_customer_profile_update', 'portal_customer_profile_change_submit',
      'portal_customer_profile_change_cancel', 'portal_customer_security', 'portal_subscription_view',
      'portal_subscription_change_submit', 'portal_initial_subscription_submit',
      'portal_subscription_change_cancel',
      'portal_initial_subscription_confirm', 'portal_entitlement_check']
    let portalCustomerUuid = ''
    let portalSuperadmin = false
    let portalActorRole = ''
    let portalActorIdentityUuid = ''
    if (portalActions.includes(action)) {
      const requestedCustomerUuid = body.customer_uuid
      if (!isUuid(requestedCustomerUuid)) return json({ error: 'invalid_request' }, 400)
      const actorIdentityUuid = body.actor_identity_uuid
      if (isUuid(actorIdentityUuid)) {
        const actor = await db`select m.customer_uuid::text, m.role
          from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
          where m.identity_uuid=${actorIdentityUuid}::uuid and m.customer_uuid=${requestedCustomerUuid}::uuid
            and m.status='active' and i.status='active' limit 1`
        if (actor.length !== 1) return json({ error: 'forbidden' }, 403)
        portalActorRole = actor[0].role
        portalActorIdentityUuid = actorIdentityUuid
        if (!['portal_customer_profile', 'portal_customer_profile_update', 'portal_customer_profile_change_submit',
          'portal_customer_profile_change_cancel', 'portal_subscription_view', 'portal_subscription_change_submit'].includes(action) &&
          action !== 'portal_initial_subscription_submit' &&
          action !== 'portal_initial_subscription_confirm' &&
          action !== 'portal_subscription_change_cancel' &&
          action !== 'portal_entitlement_check' &&
          !['owner', 'customer_admin'].includes(portalActorRole)) {
          return json({ error: 'forbidden' }, 403)
        }
      } else {
        portalSuperadmin = body.actor_superadmin === true
        if (!portalSuperadmin && body.actor_admin !== true) return json({ error: 'forbidden' }, 403)
        if (!portalSuperadmin) {
          const scoped = await db`select 1 from public.mphone_customer_tenants ct
            join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
            where ct.customer_uuid=${requestedCustomerUuid}::uuid and ct.status='active'
              and t.fusion_domain_uuid=${operatorDomainUuid}::uuid and t.enabled=true limit 1`
          if (scoped.length !== 1) return json({ error: 'forbidden' }, 403)
        }
      }
      portalCustomerUuid = requestedCustomerUuid
    }

    if (action === 'portal_entitlement_check') {
      const batch = Array.isArray(body.capabilities)
      const requestedCapabilities = batch
        ? [...new Set(body.capabilities.map((value: unknown) => String(value)))]
        : [String(body.capability ?? '')]
      const allowedCapabilities = ['call_forwarding','external_forwarding','call_history','outbound_calling',
        'call_statistics','call_recording','recording_download','speech_to_text','ai_summary','auto_dialer',
        'ai_auto_answer']
      if (requestedCapabilities.length === 0 || requestedCapabilities.some((capability) => !allowedCapabilities.includes(capability))) {
        return json({ error:'invalid_request' },400)
      }
      const rows = await db`select resolved_entitlement_uuid::text,subscription_uuid::text,capabilities,
        checksum,status,generation,enforcement_mode from public.mphone_resolved_entitlements
        where customer_uuid=${portalCustomerUuid}::uuid
        order by case when status='active' then 0 else 1 end,resolved_at desc limit 1`
      const entitlement = rows[0]
      const enforcementMode = entitlement?.enforcement_mode ?? 'observe'
      const decisions: Record<string, unknown> = {}
      for (const capability of requestedCapabilities) {
        const effectiveAllowed = entitlement?.status === 'active' && entitlement?.capabilities?.[capability] === true
        const allowed = enforcementMode === 'observe' || effectiveAllowed
        if (!effectiveAllowed) await audit(enforcementMode === 'observe' ? 'observed_denial' : 'denied',
          'customer',portalCustomerUuid,{ capability,subscription_uuid:entitlement?.subscription_uuid ?? null,
            generation:entitlement?.generation ?? null,checksum:entitlement?.checksum ?? null })
        decisions[capability] = { allowed,effective_allowed:effectiveAllowed,enforcement_mode:enforcementMode,
          generation:entitlement?.generation ?? null,checksum:entitlement?.checksum ?? null }
      }
      return batch ? json({ decisions }) : json(decisions[requestedCapabilities[0]])
    }

    if (action === 'portal_subscription_view') {
      await db`update public.mphone_initial_subscription_requests set status='expired',updated_at=now()
        where customer_uuid=${portalCustomerUuid}::uuid and status='quoted' and quote_expires_at<=now()`
      const subscriptions = await db`select s.subscription_uuid::text,s.display_name,s.billing_cycle,
        s.assigned_extension_count,s.billable_quantity,s.period_start::text,s.period_end::text,
        s.next_renewal_date::text,s.unit_monthly_price,s.discount_percent,s.vat_rate,s.untaxed_amount,
        s.vat_amount,s.total_amount,s.currency,s.status,s.extension_discrepancy,p.plan_uuid::text,p.code,
        p.display_name as name
        from public.mphone_subscriptions s join public.mphone_service_plans p on p.plan_uuid=s.plan_uuid
        where s.customer_uuid=${portalCustomerUuid}::uuid and s.status<>'cancelled'
        order by s.created_at desc`
      const activations = await db`select a.activation_uuid::text,a.subscription_uuid::text,
        a.billing_period_uuid::text,a.operation_uuid::text,a.requested_quantity,
        a.provisioned_quantity,a.status,a.error_code,a.paid_at::text,a.reserved_at::text,
        a.completed_at::text,a.updated_at::text
        from public.mphone_subscription_activations a
        where a.customer_uuid=${portalCustomerUuid}::uuid order by a.created_at desc`
      const changeActivations = await db`select a.activation_uuid::text,a.change_uuid::text,
        a.subscription_uuid::text,a.billing_period_uuid::text,a.operation_uuid::text,
        a.previous_quantity,a.target_quantity,a.delta_quantity,a.provisioned_quantity,
        a.status,a.error_code,a.paid_at::text,a.reserved_at::text,a.completed_at::text,a.updated_at::text
        from public.mphone_subscription_change_activations a
        where a.customer_uuid=${portalCustomerUuid}::uuid order by a.created_at desc`
      const plans = await db`select p.plan_uuid::text,p.code,p.display_name as name,b.amount,b.currency
        from public.mphone_service_plans p join lateral (select amount,currency from public.mphone_price_books b
          where b.plan_uuid=p.plan_uuid and b.status='published' and b.billing_cycle='monthly'
            and b.effective_from<=current_date and (b.effective_until is null or b.effective_until>=current_date)
          order by b.effective_from desc limit 1) b on true where p.status='active' order by b.amount`
      const requests = await db`select r.request_uuid::text,r.subscription_uuid::text,r.change_type,
        r.requested_plan_uuid::text,r.requested_quantity,r.requested_billing_cycle,r.reason,r.status,
        r.odoo_change_uuid::text,r.error_code,r.selected_extension_uuids::text[],r.impact_snapshot,
        r.created_at::text,r.updated_at::text
        from public.mphone_subscription_change_requests r where r.customer_uuid=${portalCustomerUuid}::uuid
        order by r.created_at desc limit 20`
      const reductionSchedules = await db`select s.schedule_uuid::text,s.change_uuid::text,s.request_uuid::text,
        s.subscription_uuid::text,s.previous_quantity,s.target_quantity,s.selected_count,s.effective_date::text,
        s.status,s.operation_uuid::text,s.error_code,s.recovery_until::text,s.cancelled_at::text,
        s.executed_at::text,s.restored_at::text,s.created_at::text,s.updated_at::text
        from public.mphone_extension_reduction_schedules s where s.customer_uuid=${portalCustomerUuid}::uuid
        order by s.created_at desc limit 20`
      const reductionItems = await db`select i.item_uuid::text,i.schedule_uuid::text,i.extension_uuid::text,
        i.extension_number,i.impact_snapshot,i.status,i.error_code,i.suspended_at::text,i.restored_at::text
        from public.mphone_extension_reduction_items i where i.customer_uuid=${portalCustomerUuid}::uuid
        order by i.extension_number`
      const ownedExtensions = await db`select ce.extension_uuid::text,ce.fusion_domain_uuid::text,
        coalesce(r.configuration_status,'configured') as configuration_status
        from public.mphone_customer_extensions ce left join public.mphone_extension_number_reservations r
          on r.customer_uuid=ce.customer_uuid and r.extension_uuid=ce.extension_uuid
        where ce.customer_uuid=${portalCustomerUuid}::uuid and ce.status='active'`
      const ownedUuids = ownedExtensions.map((row) => row.extension_uuid)
      const fusionExtensionRows = ownedUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        extension,effective_caller_id_name as display_name,enabled::text,
        (coalesce(forward_all_enabled,false) or coalesce(forward_busy_enabled,false)
          or coalesce(forward_no_answer_enabled,false) or coalesce(forward_user_not_registered_enabled,false)
          or coalesce(follow_me_enabled,false)) as has_forwarding
        from v_extensions where extension_uuid=any(${ownedUuids}::uuid[]) order by extension`
      const assignmentCounts = ownedUuids.length === 0 ? [] : await db`select extension_uuid::text,
        count(*)::int as assignment_count from public.mphone_extension_assignments
        where customer_uuid=${portalCustomerUuid}::uuid and extension_uuid=any(${ownedUuids}::uuid[])
          and status='active' group by extension_uuid`
      const fusionUserCounts = ownedUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        count(*)::int as fusion_user_count from v_extension_users
        where extension_uuid=any(${ownedUuids}::uuid[]) group by extension_uuid`
      const campaignCounts = ownedUuids.length === 0 ? [] : await fusion`select source_extension_uuid::text as extension_uuid,
        count(*)::int as campaign_count from v_dialer_campaigns
        where source_extension_uuid=any(${ownedUuids}::uuid[])
          and campaign_status in ('draft','scheduled','running','paused') group by source_extension_uuid`
      const fusionExtensionMap = new Map(fusionExtensionRows.map((row) => [row.extension_uuid,row]))
      const assignmentMap = new Map(assignmentCounts.map((row) => [row.extension_uuid,Number(row.assignment_count)]))
      const fusionUserMap = new Map(fusionUserCounts.map((row) => [row.extension_uuid,Number(row.fusion_user_count)]))
      const campaignMap = new Map(campaignCounts.map((row) => [row.extension_uuid,Number(row.campaign_count)]))
      const reductionExtensions = ownedExtensions.map((row) => ({ ...row,
        ...(fusionExtensionMap.get(row.extension_uuid) ?? {}),
        assignment_count:assignmentMap.get(row.extension_uuid) ?? 0,
        fusion_user_count:fusionUserMap.get(row.extension_uuid) ?? 0,
        campaign_count:campaignMap.get(row.extension_uuid) ?? 0 }))
      const initialRequests = await db`select r.request_uuid::text,r.requested_plan_uuid::text,
        r.requested_quantity,r.requested_billing_cycle,r.status,r.subscription_uuid::text,
        r.billing_period_uuid::text,r.error_code,r.quote_unit_monthly_price,
        r.quote_discount_percent,r.quote_vat_rate,r.quote_untaxed_amount,r.quote_vat_amount,
        r.quote_total_amount,r.quote_currency,r.quote_service_from::text,r.quote_service_until::text,
        r.quote_expires_at::text,r.notification_status,r.created_at::text,r.updated_at::text,
        p.code,p.display_name as plan_name
        from public.mphone_initial_subscription_requests r
        join public.mphone_service_plans p on p.plan_uuid=r.requested_plan_uuid
        where r.customer_uuid=${portalCustomerUuid}::uuid order by r.created_at desc limit 20`
      const entitlements = await db`select r.subscription_uuid::text,r.capabilities,r.checksum,r.status,
        r.generation,r.capability_schema_version,r.subscription_status,r.billable_quantity,
        r.enforcement_mode,r.resolved_at::text from public.mphone_resolved_entitlements r
        where r.customer_uuid=${portalCustomerUuid}::uuid
        order by case when r.status='active' then 0 else 1 end,r.resolved_at desc limit 1`
      const currentSubscription = subscriptions.find((item) => item.status === 'active')
      const currentActivation = currentSubscription ? activations.find((item) =>
        item.subscription_uuid === currentSubscription.subscription_uuid) : null
      const enabledExtensionCount = reductionExtensions.filter((item) => item.enabled === 'true').length
      const unconfiguredExtensionCount = reductionExtensions.filter((item) => item.configuration_status === 'unconfigured').length
      const provisioningReadiness = currentSubscription ? {
        commercial_ready: currentSubscription.status === 'active',
        activation_ready: !currentActivation || currentActivation.status === 'completed',
        inventory_ready: reductionExtensions.length === Number(currentSubscription.billable_quantity)
          && enabledExtensionCount === Number(currentSubscription.billable_quantity),
        entitlement_ready: entitlements[0]?.status === 'active',
        extension_count: reductionExtensions.length, enabled_extension_count: enabledExtensionCount,
        unconfigured_extension_count: unconfiguredExtensionCount,
        ready_to_configure: currentSubscription.status === 'active'
          && (!currentActivation || currentActivation.status === 'completed')
          && reductionExtensions.length === Number(currentSubscription.billable_quantity)
          && enabledExtensionCount === Number(currentSubscription.billable_quantity)
          && entitlements[0]?.status === 'active',
      } : null
      return json({ subscriptions,activations,change_activations:changeActivations,
        plans,requests,reduction_schedules:reductionSchedules,reduction_items:reductionItems,
        reduction_extensions:reductionExtensions,initial_requests:initialRequests,
        entitlement:entitlements[0] ?? null,provisioning_readiness:provisioningReadiness,capabilities: {
          request_change: ['owner','customer_admin'].includes(portalActorRole),
          initial_subscription: ['owner','customer_admin'].includes(portalActorRole) } })
    }

    if (action === 'portal_initial_subscription_submit') {
      if (!['owner','customer_admin'].includes(portalActorRole) || !isUuid(portalActorIdentityUuid)) {
        return json({ error:'forbidden' },403)
      }
      const requestedPlanUuid = body.requested_plan_uuid
      const requestedBillingCycle = String(body.requested_billing_cycle ?? '')
      const requestedQuantity = body.requested_quantity
      const idempotencyKey = body.idempotency_key
      if (!isUuid(requestedPlanUuid) || !['monthly','annual'].includes(requestedBillingCycle) ||
        !Number.isInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > 99900 ||
        !isUuid(idempotencyKey)) return json({ error:'invalid_request' },400)
      const existingSubscription = await db`select subscription_uuid::text,status
        from public.mphone_subscriptions where customer_uuid=${portalCustomerUuid}::uuid
          and status in ('pending_payment','paid','provisioning','provisioning_partial','active','past_due','suspended') limit 1`
      if (existingSubscription.length) return json({ error:'subscription_exists',
        subscription_uuid:existingSubscription[0].subscription_uuid,status:existingSubscription[0].status },409)
      const plan = await db`select p.plan_uuid::text from public.mphone_service_plans p
        where p.plan_uuid=${requestedPlanUuid}::uuid and p.status='active'
          and exists (select 1 from public.mphone_price_books b where b.plan_uuid=p.plan_uuid
            and b.billing_cycle='monthly' and b.status='published' and b.effective_from<=current_date
            and (b.effective_until is null or b.effective_until>=current_date)) limit 1`
      if (!plan.length) return json({ error:'plan_not_available' },409)
      const duplicate = await db`select request_uuid::text,status from public.mphone_initial_subscription_requests
        where customer_uuid=${portalCustomerUuid}::uuid and
          (idempotency_key=${idempotencyKey}::uuid or status in
            ('quote_submitted','quoted','manual_review','confirmed','processing','pending_payment'))
        order by created_at desc limit 1`
      if (duplicate.length) return json({ error:'subscription_request_open',...duplicate[0] },409)
      const created = await db.begin(async (transaction) => {
        const rows = await transaction`insert into public.mphone_initial_subscription_requests
          (customer_uuid,requested_plan_uuid,requested_billing_cycle,requested_quantity,
            requested_by_identity_uuid,idempotency_key)
          values (${portalCustomerUuid}::uuid,${requestedPlanUuid}::uuid,${requestedBillingCycle},
            ${requestedQuantity},${portalActorIdentityUuid}::uuid,${idempotencyKey}::uuid)
          on conflict do nothing
          returning request_uuid::text`
        if (!rows.length) return null
        const requestUuid = rows[0].request_uuid
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider,event_type,customer_uuid,payload) values ('odoo','subscription.initial.quote.requested',
            ${portalCustomerUuid}::uuid,${transaction.json({ request_uuid:requestUuid,
              customer_uuid:portalCustomerUuid,requested_plan_uuid:requestedPlanUuid,
              requested_billing_cycle:requestedBillingCycle,requested_quantity:requestedQuantity,
              requested_by_identity_uuid:portalActorIdentityUuid })}) returning outbox_uuid::text`
        await transaction`update public.mphone_initial_subscription_requests
          set outbox_uuid=${outbox[0].outbox_uuid}::uuid,updated_at=now()
          where request_uuid=${requestUuid}::uuid`
        return requestUuid
      })
      if (!created) {
        const open = await db`select request_uuid::text,status from public.mphone_initial_subscription_requests
          where customer_uuid=${portalCustomerUuid}::uuid and status in
            ('quote_submitted','quoted','manual_review','confirmed','processing','pending_payment')
          order by created_at desc limit 1`
        return json({ error:'subscription_request_open',...(open[0] ?? {}) },409)
      }
      await audit('accepted','initial_subscription_request',created,{ customer_uuid:portalCustomerUuid,
        requested_plan_uuid:requestedPlanUuid,requested_billing_cycle:requestedBillingCycle,
        requested_quantity:requestedQuantity })
      return json({ submitted:true,request_uuid:created },201)
    }

    if (action === 'portal_initial_subscription_confirm') {
      if (!['owner','customer_admin'].includes(portalActorRole) || !isUuid(portalActorIdentityUuid) ||
        !isUuid(body.request_uuid)) return json({ error:'forbidden' },403)
      const requestUuid = body.request_uuid
      const confirmed = await db.begin(async (transaction) => {
        const rows = await transaction`update public.mphone_initial_subscription_requests set
          status='confirmed',confirmed_at=now(),error_code=null,updated_at=now()
          where request_uuid=${requestUuid}::uuid and customer_uuid=${portalCustomerUuid}::uuid
            and status='quoted' and quote_expires_at>now() and subscription_uuid is null
          returning requested_plan_uuid::text,requested_billing_cycle,requested_quantity`
        if (!rows.length) return null
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider,event_type,customer_uuid,payload) values ('odoo','subscription.initial.confirmed',
          ${portalCustomerUuid}::uuid,${transaction.json({ request_uuid:requestUuid,
            customer_uuid:portalCustomerUuid,confirmed_by_identity_uuid:portalActorIdentityUuid })})
          returning outbox_uuid::text`
        await transaction`update public.mphone_initial_subscription_requests
          set confirmation_outbox_uuid=${outbox[0].outbox_uuid}::uuid,updated_at=now()
          where request_uuid=${requestUuid}::uuid`
        return outbox[0].outbox_uuid
      })
      if (!confirmed) return json({ error:'quote_not_confirmable' },409)
      await audit('accepted','initial_subscription_confirmation',requestUuid,
        { customer_uuid:portalCustomerUuid })
      return json({ confirmed:true,request_uuid:requestUuid },202)
    }

    if (action === 'portal_subscription_change_submit') {
      if (!['owner','customer_admin'].includes(portalActorRole) || !isUuid(portalActorIdentityUuid)) {
        return json({ error:'forbidden' },403)
      }
      const subscriptionUuid = body.subscription_uuid
      const requestedAction = String(body.change_type ?? '')
      const requestedPlanUuid = body.requested_plan_uuid ?? null
      const requestedQuantity = body.requested_quantity ?? null
      const requestedBillingCycle = body.requested_billing_cycle ?? null
      const selectedExtensionUuids = Array.isArray(body.selected_extension_uuids) ?
        [...new Set(body.selected_extension_uuids)] : []
      const reason = String(body.reason ?? '').trim()
      if (!isUuid(subscriptionUuid) ||
        !['quantity_change','plan_cycle_change','cancel_at_renewal'].includes(requestedAction) ||
        (requestedPlanUuid !== null && !isUuid(requestedPlanUuid)) ||
        (requestedQuantity !== null && (!Number.isInteger(requestedQuantity) || requestedQuantity < 1)) ||
        selectedExtensionUuids.some((value) => !isUuid(value)) ||
        (requestedBillingCycle !== null && !['monthly','annual'].includes(requestedBillingCycle)) || reason.length > 1000) {
        return json({ error:'invalid_request' },400)
      }
      const subscription = await db`select subscription_uuid::text,plan_uuid::text,billing_cycle,
          assigned_extension_count,billable_quantity,unit_monthly_price from public.mphone_subscriptions
        where subscription_uuid=${subscriptionUuid}::uuid and customer_uuid=${portalCustomerUuid}::uuid
          and status in ('active','past_due','suspended') limit 1`
      if (subscription.length !== 1) return json({ error:'subscription_not_found' },404)
      let changeType = requestedAction
      let impactSnapshot: Record<string,unknown> = {}
      if (requestedAction === 'quantity_change') {
        if (!Number.isInteger(requestedQuantity) || requestedQuantity === subscription[0].billable_quantity) {
          return json({ error:'subscription_unchanged' },409)
        }
        changeType = requestedQuantity > subscription[0].billable_quantity ? 'increase_quantity' : 'decrease_quantity'
        if (changeType === 'increase_quantity' &&
          requestedQuantity - subscription[0].billable_quantity > 9999) {
          return json({ error:'increase_quantity_too_large' },400)
        }
        if (changeType === 'increase_quantity' &&
          subscription[0].assigned_extension_count !== subscription[0].billable_quantity) {
          return json({ error:'extension_inventory_mismatch' },409)
        }
        if (changeType === 'increase_quantity' && selectedExtensionUuids.length) {
          return json({ error:'unexpected_extension_selection' },400)
        }
        if (changeType === 'decrease_quantity') {
          const expectedCount = Number(subscription[0].billable_quantity)-Number(requestedQuantity)
          if (expectedCount < 1 || selectedExtensionUuids.length !== expectedCount ||
            subscription[0].assigned_extension_count !== subscription[0].billable_quantity) {
            return json({ error:'reduction_selection_mismatch' },409)
          }
          const owned = await db`select ce.extension_uuid::text from public.mphone_customer_extensions ce
            where ce.customer_uuid=${portalCustomerUuid}::uuid and ce.status='active'
              and ce.extension_uuid=any(${selectedExtensionUuids}::uuid[])`
          if (owned.length !== expectedCount) return json({ error:'reduction_extension_not_owned' },409)
          const fusionRows = await fusion`select extension_uuid::text,extension,
            (coalesce(forward_all_enabled,false) or coalesce(forward_busy_enabled,false)
              or coalesce(forward_no_answer_enabled,false) or coalesce(forward_user_not_registered_enabled,false)
              or coalesce(follow_me_enabled,false)) as has_forwarding
            from v_extensions where extension_uuid=any(${selectedExtensionUuids}::uuid[])
              and enabled::text='true'`
          if (fusionRows.length !== expectedCount) return json({ error:'reduction_extension_unavailable' },409)
          const assignments = await db`select extension_uuid::text,count(*)::int as assignment_count
            from public.mphone_extension_assignments where customer_uuid=${portalCustomerUuid}::uuid
              and extension_uuid=any(${selectedExtensionUuids}::uuid[]) and status='active'
            group by extension_uuid`
          const fusionUsers = await fusion`select extension_uuid::text,count(*)::int as fusion_user_count
            from v_extension_users where extension_uuid=any(${selectedExtensionUuids}::uuid[])
            group by extension_uuid`
          const campaigns = await fusion`select source_extension_uuid::text as extension_uuid,count(*)::int as campaign_count
            from v_dialer_campaigns where source_extension_uuid=any(${selectedExtensionUuids}::uuid[])
              and campaign_status in ('draft','scheduled','running','paused') group by source_extension_uuid`
          const assignmentMap = new Map(assignments.map((row) => [row.extension_uuid,Number(row.assignment_count)]))
          const fusionUserMap = new Map(fusionUsers.map((row) => [row.extension_uuid,Number(row.fusion_user_count)]))
          const campaignMap = new Map(campaigns.map((row) => [row.extension_uuid,Number(row.campaign_count)]))
          impactSnapshot = Object.fromEntries(fusionRows.map((row) => [row.extension_uuid,{
            extension:row.extension,has_forwarding:row.has_forwarding === true,
            assignment_count:assignmentMap.get(row.extension_uuid) ?? 0,
            fusion_user_count:fusionUserMap.get(row.extension_uuid) ?? 0,
            campaign_count:campaignMap.get(row.extension_uuid) ?? 0 }]))
        }
      } else if (requestedAction === 'plan_cycle_change') {
        if (!isUuid(requestedPlanUuid) || !['monthly','annual'].includes(String(requestedBillingCycle))) {
          return json({ error:'invalid_request' },400)
        }
        const planChanged = requestedPlanUuid !== subscription[0].plan_uuid
        const cycleChanged = requestedBillingCycle !== subscription[0].billing_cycle
        if (!planChanged && !cycleChanged) return json({ error:'subscription_unchanged' },409)
        if (planChanged && cycleChanged) changeType = 'change_plan_cycle'
        else if (cycleChanged) changeType = 'change_cycle'
        else {
          const target = await db`select amount from public.mphone_price_books where plan_uuid=${requestedPlanUuid}::uuid
            and billing_cycle='monthly' and status='published' order by effective_from desc limit 1`
          if (target.length !== 1 || Number(target[0].amount) === Number(subscription[0].unit_monthly_price)) {
            return json({ error:'invalid_request' },400)
          }
          changeType = Number(target[0].amount) > Number(subscription[0].unit_monthly_price) ? 'upgrade_plan' : 'downgrade_plan'
        }
      }
      const created = await db.begin(async (transaction) => {
        const requestRows = await transaction`insert into public.mphone_subscription_change_requests
          (customer_uuid,subscription_uuid,change_type,requested_plan_uuid,requested_quantity,
            requested_billing_cycle,reason,requested_by_identity_uuid,selected_extension_uuids,impact_snapshot)
          values (${portalCustomerUuid}::uuid,${subscriptionUuid}::uuid,${changeType},${requestedPlanUuid}::uuid,
            ${requestedQuantity},${requestedBillingCycle},${reason || null},${portalActorIdentityUuid}::uuid,
            ${selectedExtensionUuids.length ? selectedExtensionUuids : null}::uuid[],${transaction.json(impactSnapshot)})
          returning request_uuid::text`
        const requestUuid = requestRows[0].request_uuid
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider,event_type,customer_uuid,payload) values ('odoo','subscription.change.requested',
            ${portalCustomerUuid}::uuid,${transaction.json({ request_uuid:requestUuid,customer_uuid:portalCustomerUuid,
              subscription_uuid:subscriptionUuid,change_type:changeType,requested_plan_uuid:requestedPlanUuid,
              requested_quantity:requestedQuantity,requested_billing_cycle:requestedBillingCycle,reason:reason || null,
              selected_extension_uuids:selectedExtensionUuids.length ? selectedExtensionUuids : null,
              impact_snapshot:impactSnapshot,requested_by_identity_uuid:portalActorIdentityUuid })}) returning outbox_uuid::text`
        await transaction`update public.mphone_subscription_change_requests set outbox_uuid=${outbox[0].outbox_uuid}::uuid,
          updated_at=now() where request_uuid=${requestUuid}::uuid`
        return requestUuid
      })
      await audit('accepted','subscription_change_request',created,{ customer_uuid:portalCustomerUuid,
        subscription_uuid:subscriptionUuid,change_type:changeType })
      return json({ submitted:true,request_uuid:created },201)
    }

    if (action === 'portal_subscription_change_cancel') {
      if (!['owner','customer_admin'].includes(portalActorRole) || !isUuid(portalActorIdentityUuid) ||
        !isUuid(body.request_uuid)) return json({ error:'forbidden' },403)
      const requestUuid = body.request_uuid
      const cancelled = await db.begin(async (transaction) => {
        const rows = await transaction`select request_uuid::text,odoo_change_uuid::text,status,change_type
          from public.mphone_subscription_change_requests where request_uuid=${requestUuid}::uuid
            and customer_uuid=${portalCustomerUuid}::uuid for update`
        if (rows.length !== 1 || rows[0].change_type !== 'decrease_quantity' ||
          rows[0].status !== 'scheduled' || !isUuid(rows[0].odoo_change_uuid)) return null
        await transaction`select public.mphone_cancel_extension_reduction(${requestUuid}::uuid,
          ${portalCustomerUuid}::uuid,${portalActorIdentityUuid}::uuid)`
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider,event_type,customer_uuid,payload) values ('odoo','subscription.change.cancel.requested',
          ${portalCustomerUuid}::uuid,${transaction.json({ request_uuid:requestUuid,
            change_uuid:rows[0].odoo_change_uuid,customer_uuid:portalCustomerUuid,
            cancelled_by_identity_uuid:portalActorIdentityUuid })}) returning outbox_uuid::text`
        return outbox[0].outbox_uuid
      })
      if (!cancelled) return json({ error:'reduction_not_cancellable' },409)
      await audit('accepted','subscription_reduction_cancel',requestUuid,{ customer_uuid:portalCustomerUuid })
      return json({ cancellation_requested:true,request_uuid:requestUuid },202)
    }

    if (action === 'portal_users_list') {
      const memberships = await db`select m.membership_uuid::text, m.identity_uuid::text,
        i.primary_email, i.status as identity_status, i.email_verified_at::text,
        i.legacy_fusion_user_uuid::text as fusion_user_uuid,
        m.customer_uuid::text, c.display_name as customer_name,
        m.role, m.status, m.created_at::text, m.updated_at::text
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        join public.mphone_customers c on c.customer_uuid=m.customer_uuid
        where m.customer_uuid=${portalCustomerUuid}::uuid and m.status<>'removed'
        order by case m.role when 'owner' then 0 when 'customer_admin' then 1 else 2 end, i.primary_email`
      const fusionUserUuids = memberships.map((row) => row.fusion_user_uuid).filter(isUuid)
      const fusionUsers = fusionUserUuids.length === 0 ? [] : await fusion`select user_uuid::text, username
        from v_users where user_uuid=any(${fusionUserUuids}::uuid[])`
      const fusionUserMap = new Map(fusionUsers.map((row) => [row.user_uuid, row.username]))
      const fusionLinks = fusionUserUuids.length === 0 ? [] : await fusion`
        select eu.user_uuid::text, eu.extension_uuid::text
        from v_extension_users eu join v_extensions e on e.extension_uuid=eu.extension_uuid
        where eu.user_uuid=any(${fusionUserUuids}::uuid[]) and e.enabled::text='true'`
      const staleIdentityUuids = memberships
        // An email-only Mphone identity is valid and must not be removed merely because
        // it has never been linked to a Fusion user.
        .filter((row) => isUuid(row.fusion_user_uuid) && !fusionUserMap.has(row.fusion_user_uuid))
        .map((row) => row.identity_uuid)
      if (staleIdentityUuids.length > 0) {
        await db.begin(async (transaction) => {
          await transaction`update public.mphone_memberships set status='removed', updated_at=now()
            where customer_uuid=${portalCustomerUuid}::uuid
              and identity_uuid=any(${staleIdentityUuids}::uuid[]) and status<>'removed'`
          await transaction`update public.mphone_extension_assignments set status='removed', can_use=false,
            can_manage=false, updated_at=now() where customer_uuid=${portalCustomerUuid}::uuid
              and identity_uuid=any(${staleIdentityUuids}::uuid[]) and status='active'`
          await transaction`update public.mphone_identities i set status='disabled', updated_at=now()
            where i.identity_uuid=any(${staleIdentityUuids}::uuid[]) and not exists
              (select 1 from public.mphone_memberships m where m.identity_uuid=i.identity_uuid
                and m.status in ('active', 'invited', 'suspended'))`
        })
        await audit('accepted', 'identity', undefined,
          { customer_uuid: portalCustomerUuid, reconciliation: 'fusion_user_removed', identities: staleIdentityUuids.length })
      }
      const membershipRows = memberships
        .filter((row) => !staleIdentityUuids.includes(row.identity_uuid))
        .map((row) => ({ ...row,
        username: fusionUserMap.get(row.fusion_user_uuid) ?? '' }))
      const extensions = await db`select ce.extension_uuid::text, ce.fusion_domain_uuid::text
        from public.mphone_customer_extensions ce
        where ce.customer_uuid=${portalCustomerUuid}::uuid and ce.status='active'`
      const extensionUuids = extensions.map((row) => row.extension_uuid)
      const fusionExtensions = extensionUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        extension, effective_caller_id_name as display_name from v_extensions
        where extension_uuid=any(${extensionUuids}::uuid[]) and enabled::text='true' order by extension`
      const customerDomains = portalSuperadmin ? await db`select distinct t.fusion_domain_uuid::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t
          on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where ct.customer_uuid=${portalCustomerUuid}::uuid and ct.status='active'` : []
      const candidateExtensions = customerDomains.length === 0 ? [] : await fusion`
        select extension_uuid::text,extension,effective_caller_id_name as display_name
        from v_extensions where domain_uuid=any(${customerDomains.map((row) => row.fusion_domain_uuid)}::uuid[])
          and enabled::text='true' order by extension`
      const candidateUuids = candidateExtensions.map((row) => row.extension_uuid)
      const candidateOwnership = candidateUuids.length === 0 ? [] : await db`
        select extension_uuid::text,customer_uuid::text from public.mphone_customer_extensions
        where extension_uuid=any(${candidateUuids}::uuid[]) and status='active'`
      const candidateOwnerMap = new Map(candidateOwnership.map((row) => [row.extension_uuid, row.customer_uuid]))
      const assignments = await db`select assignment_uuid::text, identity_uuid::text,
        customer_uuid::text, extension_uuid::text, can_use, can_manage
        from public.mphone_extension_assignments
        where customer_uuid=${portalCustomerUuid}::uuid and status='active'`
      return json({ memberships: membershipRows, extensions: fusionExtensions,
        extension_candidates: candidateExtensions.map((row) => ({ ...row,
          owner_customer_uuid: candidateOwnerMap.get(row.extension_uuid) ?? null })), assignments,
        fusion_links: fusionLinks,
        capabilities: { superadmin: portalSuperadmin } })
    }

    if (action === 'portal_customer_profile') {
      const rows = await db`select c.customer_uuid::text, c.customer_code, c.display_name,
        c.customer_type, c.status, c.origin_system, c.operational_contact_email,
        c.operational_contact_phone, c.profile_version, c.created_at::text, c.updated_at::text,
        p.legal_name, p.contact_email, p.phone, p.street, p.street2, p.city, p.postal_code,
        p.country_code, p.tax_id, p.website, p.source_updated_at::text,
        r.external_id, r.last_synced_at::text, r.sync_status,
        latest_profile_outbox.status as operational_sync_status,
        latest_profile_outbox.last_error_code as operational_sync_error
        from public.mphone_customers c
        left join public.mphone_customer_profiles p on p.customer_uuid=c.customer_uuid
        left join public.mphone_customer_external_refs r on r.customer_uuid=c.customer_uuid
          and r.provider='odoo' and r.sync_status='active'
        left join lateral (select o.status, o.last_error_code
          from public.mphone_integration_outbox o where o.customer_uuid=c.customer_uuid
            and o.provider='odoo' and o.event_type='customer.operational_profile.updated'
          order by o.created_at desc limit 1) latest_profile_outbox on true
        where c.customer_uuid=${portalCustomerUuid}::uuid limit 1`
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      const changeRequests = await db`select r.request_uuid::text, r.request_type, r.old_values,
        r.new_values, r.changed_fields, r.status, r.review_note, r.submitted_at::text,
        r.reviewed_at::text, r.completed_at::text, r.updated_at::text,
        o.status as outbox_status, o.last_error_code as outbox_error
        from public.mphone_customer_profile_change_requests r
        left join public.mphone_integration_outbox o on o.outbox_uuid=r.outbox_uuid
        where r.customer_uuid=${portalCustomerUuid}::uuid order by r.created_at desc limit 20`
      const customer = { ...rows[0] }
      delete customer.display_name
      delete customer.customer_code
      return json({ customer, source: rows[0].external_id ? 'odoo' : rows[0].origin_system,
        profile_change_requests: changeRequests,
        field_policy: {
          operational_contact_email: { source: 'customer_platform', mode: 'direct' },
          operational_contact_phone: { source: 'customer_platform', mode: 'direct' },
          legal_name: { source: 'odoo', mode: 'read_only' },
          contact_email: { source: 'odoo', mode: 'read_only' },
          phone: { source: 'odoo', mode: 'read_only' },
          tax_id: { source: 'odoo', mode: 'read_only' },
        },
        capabilities: { edit_operational_profile: portalActorRole === 'owner',
          request_legal_change: portalActorRole === 'owner' } })
    }

    if (action === 'portal_customer_profile_change_submit') {
      if (portalActorRole !== 'owner') return json({ error: 'forbidden' }, 403)
      const allowed = ['legal_name', 'contact_email', 'phone', 'street', 'street2', 'city',
        'postal_code', 'country_code', 'tax_id']
      const raw = body.legal_profile
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return json({ error: 'invalid_request' }, 400)
      const input = raw as Record<string, unknown>
      const limits: Record<string, number> = { legal_name: 160, contact_email: 254, phone: 64,
        street: 160, street2: 160, city: 100, postal_code: 32, country_code: 2, tax_id: 64 }
      if (Object.keys(input).some((key) => !allowed.includes(key)) ||
        allowed.some((key) => !Object.hasOwn(input, key) || typeof input[key] !== 'string' || input[key].length > limits[key])) {
        return json({ error: 'invalid_request' }, 400)
      }
      const value = (key: string, max: number) => typeof input[key] === 'string' ? input[key].trim().slice(0, max) || null : null
      const newValues: Record<string, string | null> = {
        legal_name: value('legal_name', 160),
        contact_email: value('contact_email', 254)?.toLowerCase() ?? null,
        phone: value('phone', 64), street: value('street', 160), street2: value('street2', 160),
        city: value('city', 100), postal_code: value('postal_code', 32),
        country_code: value('country_code', 2)?.toUpperCase() ?? null, tax_id: value('tax_id', 64),
      }
      if (!newValues.legal_name || (newValues.contact_email && !validEmail(newValues.contact_email)) ||
        (newValues.country_code && !/^[A-Z]{2}$/.test(newValues.country_code))) {
        return json({ error: 'invalid_legal_profile' }, 400)
      }
      const created = await db.begin(async (transaction) => {
        const customers = await transaction`select customer_uuid from public.mphone_customers
          where customer_uuid=${portalCustomerUuid}::uuid and status='active' for update`
        if (!customers.length) return { result: 'not_found' }
        const open = await transaction`select request_uuid::text
          from public.mphone_customer_profile_change_requests where customer_uuid=${portalCustomerUuid}::uuid
            and status in ('submitted','under_review','approved','syncing') limit 1`
        if (open.length) return { result: 'open_exists' }
        const profiles = await transaction`select legal_name, contact_email, phone, street, street2,
          city, postal_code, country_code, tax_id, source_updated_at::text
          from public.mphone_customer_profiles where customer_uuid=${portalCustomerUuid}::uuid limit 1`
        const profile = profiles[0] ?? {}
        const oldValues: Record<string, unknown> = Object.fromEntries(Object.keys(newValues).map((key) => [key, profile[key] ?? null]))
        const changedFields = Object.keys(newValues).filter((key) => oldValues[key] !== newValues[key])
        if (!changedFields.length) return { result: 'unchanged' }
        const rows = await transaction`insert into public.mphone_customer_profile_change_requests
          (customer_uuid, requested_by_identity_uuid, base_source_updated_at, old_values,
            new_values, changed_fields, status) values (${portalCustomerUuid}::uuid,
            ${body.actor_identity_uuid}::uuid, ${profile.source_updated_at ?? null}::timestamptz,
            ${transaction.json(oldValues)}, ${transaction.json(newValues)}, ${changedFields}, 'submitted')
          returning request_uuid::text`
        return { result: 'submitted', requestUuid: rows[0].request_uuid, changedFields }
      })
      if (created.result === 'not_found') return json({ error: 'not_found' }, 404)
      if (created.result === 'open_exists') return json({ error: 'legal_change_request_open' }, 409)
      if (created.result === 'unchanged') return json({ error: 'profile_unchanged' }, 409)
      await audit('accepted', 'profile_change_request', created.requestUuid, {
        customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid,
        actor_membership_role: portalActorRole, actor_session_uuid: body.actor_session_uuid,
        request_fingerprint: body.request_fingerprint, changed_fields: created.changedFields,
      })
      return json({ submitted: true, request_uuid: created.requestUuid, status: 'submitted' })
    }

    if (action === 'portal_customer_profile_change_cancel') {
      if (portalActorRole !== 'owner' || !isUuid(body.request_uuid)) return json({ error: 'forbidden' }, 403)
      const rows = await db`update public.mphone_customer_profile_change_requests set status='cancelled',
        updated_at=now() where request_uuid=${body.request_uuid}::uuid
          and customer_uuid=${portalCustomerUuid}::uuid and status='submitted'
        returning request_uuid::text`
      if (rows.length !== 1) return json({ error: 'invalid_request_status' }, 409)
      await audit('accepted', 'profile_change_request', body.request_uuid, {
        customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid, decision: 'cancelled',
      })
      return json({ cancelled: true })
    }

    if (action === 'portal_customer_profile_update') {
      if (portalActorRole !== 'owner') {
        await audit('rejected', 'customer', portalCustomerUuid, {
          customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid,
          actor_membership_role: portalActorRole, reason: 'owner_required',
          actor_session_uuid: body.actor_session_uuid, request_fingerprint: body.request_fingerprint,
        })
        return json({ error: 'forbidden' }, 403)
      }
      const emailValue = typeof body.operational_contact_email === 'string'
        ? body.operational_contact_email.trim().toLowerCase() : ''
      const phoneValue = typeof body.operational_contact_phone === 'string'
        ? body.operational_contact_phone.trim() : ''
      const profileVersion = Number(body.profile_version)
      if ((emailValue !== '' && (!validEmail(emailValue))) ||
        phoneValue.length > 32 || (phoneValue !== '' && !/^[0-9+(). -]{3,32}$/.test(phoneValue)) ||
        !Number.isSafeInteger(profileVersion) || profileVersion < 1) {
        await audit('rejected', 'customer', portalCustomerUuid, {
          customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid,
          actor_membership_role: portalActorRole, reason: 'invalid_operational_profile',
          actor_session_uuid: body.actor_session_uuid, request_fingerprint: body.request_fingerprint,
        })
        return json({ error: 'invalid_request' }, 400)
      }
      const outcome = await db.begin(async (transaction) => {
        const before = await transaction`select operational_contact_email,
          operational_contact_phone, profile_version from public.mphone_customers
          where customer_uuid=${portalCustomerUuid}::uuid and status='active' for update`
        if (before.length !== 1) return { result: 'not_found' }
        if (Number(before[0].profile_version) !== profileVersion) return { result: 'conflict' }
        const changedFields = []
        if ((before[0].operational_contact_email ?? '') !== emailValue) changedFields.push('operational_contact_email')
        if ((before[0].operational_contact_phone ?? '') !== phoneValue) changedFields.push('operational_contact_phone')
        if (changedFields.length === 0) return { result: 'unchanged', customer: before[0], changedFields }
        const updated = await transaction`update public.mphone_customers set
          operational_contact_email=${emailValue || null},
          operational_contact_phone=${phoneValue || null}, profile_version=profile_version+1,
          updated_at=now() where customer_uuid=${portalCustomerUuid}::uuid
          returning customer_uuid::text, operational_contact_email,
            operational_contact_phone, profile_version, updated_at::text`
        const outbox = await transaction`insert into public.mphone_integration_outbox
          (provider, event_type, customer_uuid, payload) values
          ('odoo', 'customer.operational_profile.updated', ${portalCustomerUuid}::uuid,
            ${transaction.json({ customer_uuid: portalCustomerUuid,
              operational_contact_email: emailValue || null,
              operational_contact_phone: phoneValue || null,
              profile_version: updated[0].profile_version })}) returning outbox_uuid::text`
        return { result: 'updated', customer: updated[0], changedFields, outboxUuid: outbox[0].outbox_uuid }
      })
      if (outcome.result === 'not_found') return json({ error: 'not_found' }, 404)
      if (outcome.result === 'conflict') {
        await audit('rejected', 'customer', portalCustomerUuid, {
          customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid,
          actor_membership_role: portalActorRole, reason: 'profile_conflict', requested_version: profileVersion,
          actor_session_uuid: body.actor_session_uuid, request_fingerprint: body.request_fingerprint,
        })
        return json({ error: 'profile_conflict' }, 409)
      }
      if (outcome.result === 'unchanged') return json({ saved: true, unchanged: true, customer: outcome.customer })
      await audit('accepted', 'customer', portalCustomerUuid, {
        customer_uuid: portalCustomerUuid, actor_identity_uuid: body.actor_identity_uuid,
        actor_membership_role: portalActorRole, actor_session_uuid: body.actor_session_uuid,
        request_fingerprint: body.request_fingerprint, changed_fields: outcome.changedFields,
        profile_version: outcome.customer.profile_version, outbox_uuid: outcome.outboxUuid,
      })
      return json({ saved: true, customer: outcome.customer, sync_status: 'pending' })
    }

    if (action === 'portal_customer_security') {
      const events = await db`select event_uuid::text, action, result, target_type,
        created_at::text from public.mphone_customer_admin_events
        where target_uuid=${portalCustomerUuid}::uuid
          or details->>'customer_uuid'=${portalCustomerUuid}
          or details->>'source_customer_uuid'=${portalCustomerUuid}
        order by created_at desc limit 100`
      const exceptions = await db`select exception_uuid::text, source_type, reason,
        created_at::text, resolved_at::text from public.mphone_identity_migration_exceptions
        where details->>'customer_uuid'=${portalCustomerUuid}
        order by created_at desc limit 100`
      const identityRows = await db`select m.identity_uuid::text, i.primary_email
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=${portalCustomerUuid}::uuid and m.status<>'removed'`
      const identityUuids = identityRows.map((row) => row.identity_uuid)
      const emailMap = new Map(identityRows.map((row) => [row.identity_uuid, row.primary_email]))
      const authenticationEvents = identityUuids.length === 0 ? [] : await db`
        select e.event_uuid::text, e.session_uuid::text, e.actor_uuid::text, e.event_type,
          e.result, e.user_agent_summary, e.created_at::text
        from public.mphone_auth_events e join public.mphone_device_sessions s
          on s.session_uuid=e.session_uuid and s.customer_uuid=${portalCustomerUuid}::uuid
        where e.actor_uuid=any(${identityUuids}::uuid[]) order by e.created_at desc limit 100`
      const sessions = await db`select s.session_uuid::text, s.identity_uuid::text,
        s.created_at::text, s.last_seen_at::text, s.expires_at::text, s.revoked_at::text,
        s.revoke_reason, s.metadata->>'client_type' as client_type,
        s.metadata->>'device_name' as device_name, s.metadata->>'platform' as platform,
        s.metadata->>'app_version' as app_version
        from public.mphone_device_sessions s
        where s.customer_uuid=${portalCustomerUuid}::uuid
        order by coalesce(s.last_seen_at,s.created_at) desc limit 100`
      return json({ events, reconciliation_exceptions: exceptions,
        authentication_events: authenticationEvents.map((event) => ({ ...event,
          identity_email: emailMap.get(event.actor_uuid) ?? '' })),
        sessions: sessions.map((session) => ({ ...session,
          identity_email: emailMap.get(session.identity_uuid) ?? '',
          is_current: session.session_uuid === body.actor_session_uuid,
          state: session.revoked_at ? 'revoked' : new Date(session.expires_at).getTime() <= Date.now()
            ? 'expired' : 'active',
        })) })
    }

    if (action === 'portal_user_invite') {
      const email = canonicalEmail(body.email)
      const role = typeof body.role === 'string' ? body.role : 'member'
      if (!validEmail(email) || !['customer_admin', 'billing_admin', 'member'].includes(role)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const tenantDomains = await db`select t.fusion_domain_uuid::text, t.tenant_uuid::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
        where ct.customer_uuid=${portalCustomerUuid}::uuid and ct.status='active' and t.enabled=true`
      const domainUuids = tenantDomains.map((row) => row.fusion_domain_uuid)
      const users = domainUuids.length === 0 ? [] : await fusion`select user_uuid::text, domain_uuid::text,
        lower(btrim(user_email)) as user_email from v_users where lower(btrim(user_email))=${email}
          and domain_uuid=any(${domainUuids}::uuid[]) and user_enabled::text='true'`
      if (users.length !== 1) return json({ error: 'fusion_user_not_found' }, 404)
      const user = users[0]
      const membership = await db.begin(async (transaction) => {
        await transaction`select pg_advisory_xact_lock(hashtextextended(${portalCustomerUuid}, 0))`
        const existing = await transaction`select identity_uuid::text, status from public.mphone_identities
          where primary_email=${email} or legacy_fusion_user_uuid=${user.user_uuid}::uuid limit 1`
        let identityUuid = existing[0]?.identity_uuid
        if (!identityUuid) {
          const created = await transaction`insert into public.mphone_identities
            (primary_email, status, legacy_fusion_user_uuid, email_verified_at)
            values (${email}, 'pending', ${user.user_uuid}::uuid, null) returning identity_uuid::text`
          identityUuid = created[0].identity_uuid
          await transaction`insert into public.mphone_identity_providers
            (identity_uuid, provider, provider_subject, provider_email)
            values (${identityUuid}::uuid, 'password', ${email}, ${email})`
        }
        const identityStatus = existing[0]?.status ?? 'pending'
        const otherMembers = await transaction`select count(*)::int as count from public.mphone_memberships
          where customer_uuid=${portalCustomerUuid}::uuid and identity_uuid<>${identityUuid}::uuid
            and status<>'removed'`
        const effectiveRole = otherMembers[0].count === 0 ? 'owner' : role
        await transaction`insert into public.mphone_memberships
          (customer_uuid, identity_uuid, role, status, updated_at)
          values (${portalCustomerUuid}::uuid, ${identityUuid}::uuid, ${effectiveRole},
            ${identityStatus === 'active' ? 'active' : 'invited'}, now())
          on conflict (customer_uuid, identity_uuid) do update set role=excluded.role,
            status=case when public.mphone_memberships.status='active' then 'active' else excluded.status end,
            updated_at=now()`
        return { identityUuid, identityStatus, effectiveRole }
      })
      const { identityUuid, identityStatus, effectiveRole } = membership
      if (identityStatus === 'active') {
        await audit('accepted', 'identity', identityUuid,
          { customer_uuid: portalCustomerUuid, role: effectiveRole, portal: true, email_delivery: 'not_required' })
        return json({ invited: true, identity_uuid: identityUuid, email_sent: false, already_active: true })
      }
      const emailResponse = await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/functions/v1/mphone-identity-email/request-verification`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      await audit(emailResponse.ok ? 'accepted' : 'failed', 'identity', identityUuid,
        { customer_uuid: portalCustomerUuid, role: effectiveRole, portal: true, email_delivery: emailResponse.status })
      if (!emailResponse.ok) return json({ error: 'delivery_failed' }, 503)
      return json({ invited: true, identity_uuid: identityUuid })
    }

    if (action === 'portal_user_resend') {
      const identityUuid = body.identity_uuid
      if (!isUuid(identityUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db`select i.primary_email, i.status from public.mphone_memberships m
        join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=${portalCustomerUuid}::uuid and m.identity_uuid=${identityUuid}::uuid
          and m.status<>'removed' limit 1`
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      if (rows[0].status === 'disabled') return json({ error: 'mphone_account_disabled' }, 409)
      if (rows[0].status === 'active') {
        await audit('accepted', 'identity', identityUuid,
          { customer_uuid: portalCustomerUuid, portal: true, delivery_action: 'not_required' })
        return json({ resent: false, email_sent: false, already_active: true })
      }
      const endpoint = 'request-verification'
      const response = await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/functions/v1/mphone-identity-email/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rows[0].primary_email }),
      })
      await audit(response.ok ? 'accepted' : 'failed', 'identity', identityUuid,
        { customer_uuid: portalCustomerUuid, portal: true, delivery_action: endpoint, email_delivery: response.status })
      if (!response.ok) return json({ error: 'delivery_failed' }, 503)
      return json({ resent: true })
    }

    if (action === 'portal_user_update') {
      const identityUuid = body.identity_uuid
      const role = typeof body.role === 'string' ? body.role : ''
      const status = typeof body.status === 'string' ? body.status : ''
      const assignmentSource = body.assignment_source === 'fusion_import' ? 'fusion_import' : 'portal'
      if (!isUuid(identityUuid) || !['owner', 'customer_admin', 'billing_admin', 'member'].includes(role) ||
        !['active', 'suspended', 'removed'].includes(status)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const target = await db`select m.membership_uuid::text, m.role, i.status as identity_status
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=${portalCustomerUuid}::uuid and m.identity_uuid=${identityUuid}::uuid limit 1`
      if (target.length !== 1) return json({ error: 'not_found' }, 404)
      if (target[0].role === 'owner' && !portalSuperadmin && portalActorRole !== 'owner') {
        return json({ error: 'forbidden' }, 403)
      }
      if (role === 'owner' && target[0].role !== 'owner' && !portalSuperadmin) {
        return json({ error: 'forbidden' }, 403)
      }
      if (status === 'active' && target[0].identity_status !== 'active') {
        return json({ error: 'identity_not_active' }, 409)
      }
      if ((status !== 'active' || role !== 'owner') && target[0].role === 'owner') {
        const owners = await db`select count(*)::int as count from public.mphone_memberships
          where customer_uuid=${portalCustomerUuid}::uuid and role='owner' and status='active'`
        if (owners[0].count <= 1) return json({ error: 'last_owner' }, 409)
      }
      const requestedAssignments = Array.isArray(body.assignments) ? body.assignments : []
      const requestedExtensionUuids = [...new Set(requestedAssignments
        .map((item) => item?.extension_uuid).filter(isUuid))].sort()
      const customerContexts = portalSuperadmin && requestedExtensionUuids.length > 0
        ? await db`select t.tenant_uuid::text,t.fusion_domain_uuid::text
            from public.mphone_customer_tenants ct join public.mphone_login_tenants t
              on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
            where ct.customer_uuid=${portalCustomerUuid}::uuid and ct.status='active'`
        : []
      const contextByDomain = new Map(customerContexts.map((row) => [row.fusion_domain_uuid, row]))
      const candidateExtensions = portalSuperadmin && requestedExtensionUuids.length > 0 && customerContexts.length > 0
        ? await fusion`select extension_uuid::text,domain_uuid::text from v_extensions
            where extension_uuid=any(${requestedExtensionUuids}::uuid[])
              and domain_uuid=any(${customerContexts.map((row) => row.fusion_domain_uuid)}::uuid[])
              and enabled::text='true'`
        : []
      const candidateMap = new Map(candidateExtensions.map((row) => [row.extension_uuid, row]))
      await db.begin(async (transaction) => {
        await transaction`select pg_advisory_xact_lock(hashtextextended(${portalCustomerUuid}, 0))`
        for (const extensionUuid of requestedExtensionUuids) {
          await transaction`select pg_advisory_xact_lock(hashtextextended(${extensionUuid}, 1))`
        }
        await transaction`update public.mphone_memberships set role=${role}, status=${status},
          authorization_version=authorization_version+1, updated_at=now()
          where customer_uuid=${portalCustomerUuid}::uuid and identity_uuid=${identityUuid}::uuid`
        if (Array.isArray(body.assignments)) {
          const ownership = requestedExtensionUuids.length === 0 ? [] : await transaction`
            select extension_uuid::text,customer_uuid::text,tenant_uuid::text,fusion_domain_uuid::text
            from public.mphone_customer_extensions
            where extension_uuid=any(${requestedExtensionUuids}::uuid[]) and status='active' for update`
          const ownershipMap = new Map(ownership.map((row) => [row.extension_uuid, row]))
          await transaction`update public.mphone_extension_assignments set status='removed', can_use=false,
            can_manage=false, updated_at=now() where customer_uuid=${portalCustomerUuid}::uuid
              and identity_uuid=${identityUuid}::uuid and status='active'`
          if (status === 'active') for (const item of requestedAssignments) {
          if (!item || !isUuid(item.extension_uuid)) continue
          let context = ownershipMap.get(item.extension_uuid)
          if (context && context.customer_uuid !== portalCustomerUuid) continue
          if (!context && portalSuperadmin && candidateMap.has(item.extension_uuid)) {
            const extension = candidateMap.get(item.extension_uuid)
            const customerContext = contextByDomain.get(extension.domain_uuid)
            if (!customerContext) continue
            const claimed = await transaction`insert into public.mphone_customer_extensions
              (customer_uuid,tenant_uuid,fusion_domain_uuid,extension_uuid,status,updated_at)
              values (${portalCustomerUuid}::uuid,${customerContext.tenant_uuid}::uuid,
                ${extension.domain_uuid}::uuid,${item.extension_uuid}::uuid,'active',now())
              on conflict (extension_uuid) do update set customer_uuid=excluded.customer_uuid,
                tenant_uuid=excluded.tenant_uuid,fusion_domain_uuid=excluded.fusion_domain_uuid,
                status='active',updated_at=now()
              where public.mphone_customer_extensions.status<>'active'
              returning extension_uuid::text,customer_uuid::text,tenant_uuid::text,fusion_domain_uuid::text`
            context = claimed[0]
          }
          if (!context) continue
          await transaction`insert into public.mphone_extension_assignments
            (customer_uuid, identity_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid, can_use, can_manage, status, updated_at)
            values (${portalCustomerUuid}::uuid, ${identityUuid}::uuid, ${context.tenant_uuid}::uuid,
              ${context.fusion_domain_uuid}::uuid, ${item.extension_uuid}::uuid,
              ${item.can_use === true}, ${item.can_use === true}, 'active', now())
            on conflict (customer_uuid, identity_uuid, extension_uuid) do update set can_use=excluded.can_use,
              can_manage=excluded.can_manage, status='active', updated_at=now()`
          }
        }
        const remaining = await transaction`select membership_uuid::text from public.mphone_memberships
          where customer_uuid=${portalCustomerUuid}::uuid and status<>'removed' order by created_at limit 2`
        if (remaining.length === 1) await transaction`update public.mphone_memberships
          set role='owner', authorization_version=authorization_version+1, updated_at=now()
          where membership_uuid=${remaining[0].membership_uuid}::uuid and role<>'owner'`
      })
      const accessState = await db`select i.legacy_fusion_user_uuid::text as fusion_user_uuid,
        i.primary_email, exists(select 1 from public.mphone_memberships active_membership
          where active_membership.identity_uuid=i.identity_uuid and active_membership.status='active') as has_access
        from public.mphone_identities i where i.identity_uuid=${identityUuid}::uuid limit 1`
      if (accessState.length === 1) {
        if (!accessState[0].has_access) {
          await db.begin(async (transaction) => {
            await transaction`update public.mphone_identities set status='disabled', updated_at=now()
              where identity_uuid=${identityUuid}::uuid`
            await transaction`update public.mphone_device_sessions set revoked_at=coalesce(revoked_at, now()),
              revoke_reason='membership_access_removed' where identity_uuid=${identityUuid}::uuid and revoked_at is null`
          })
        }
        if (isUuid(accessState[0].fusion_user_uuid)) {
          await fusion`select public.mphone_set_portal_user_state(${accessState[0].fusion_user_uuid}::uuid,
            ${accessState[0].has_access}, ${accessState[0].primary_email})`
        }
      }
      await audit('accepted', 'identity', identityUuid,
        { customer_uuid: portalCustomerUuid, role, status, portal: true,
          assignments_updated: Array.isArray(body.assignments),
          assignment_count: Array.isArray(body.assignments) ? body.assignments.length : undefined,
          assignment_source: Array.isArray(body.assignments) ? assignmentSource : undefined })
      return json({ saved: true })
    }
    if (action === 'list') {
      const customerUuid = body.customer_uuid
      const fusionUserUuid = body.fusion_user_uuid
      if (customerUuid && !isUuid(customerUuid)) return json({ error: 'invalid_request' }, 400)
      if (fusionUserUuid && !isUuid(fusionUserUuid)) return json({ error: 'invalid_request' }, 400)
      const customers = await db`select c.customer_uuid::text, c.customer_code, c.display_name,
        c.customer_type, c.status, count(distinct m.membership_uuid)::int as membership_count,
        count(distinct a.assignment_uuid) filter (where a.status='active')::int as assignment_count
        from public.mphone_customers c
        left join public.mphone_memberships m on m.customer_uuid=c.customer_uuid and m.status='active'
        left join public.mphone_extension_assignments a on a.customer_uuid=c.customer_uuid
        group by c.customer_uuid order by c.display_name`
      if (!customerUuid) {
        const exceptions = await db`select exception_uuid::text, source_type, source_uuid::text,
          reason, details, created_at from public.mphone_identity_migration_exceptions
          where resolved_at is null order by created_at desc limit 200`
        const fusionUsers = fusionUserUuid ? await fusion`select user_uuid::text, domain_uuid::text,
          username, lower(btrim(user_email)) as user_email, user_enabled::text
          from v_users where user_uuid=${fusionUserUuid}::uuid limit 1` : []
        const linkedIdentities = fusionUserUuid ? await db`select identity_uuid::text, primary_email,
          status, email_verified_at::text from public.mphone_identities
          where legacy_fusion_user_uuid=${fusionUserUuid}::uuid limit 1` : []
        return json({ customers, exceptions, fusion_user: fusionUsers[0] ?? null,
          linked_identity: linkedIdentities[0] ?? null })
      }
      const memberships = await db`select m.membership_uuid::text, m.identity_uuid::text,
        i.primary_email, i.status as identity_status, m.role, m.status
        from public.mphone_memberships m join public.mphone_identities i on i.identity_uuid=m.identity_uuid
        where m.customer_uuid=${customerUuid}::uuid order by i.primary_email`
      const tenants = await db`select t.tenant_uuid::text, t.tenant_key, t.tenant_type,
        t.fusion_domain_uuid::text, ct.status
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid
        where ct.customer_uuid=${customerUuid}::uuid order by t.tenant_key`
      const assignments = await db`select a.assignment_uuid::text, a.identity_uuid::text,
        i.primary_email, a.extension_uuid::text, a.fusion_domain_uuid::text,
        a.can_use, a.can_manage, a.status
        from public.mphone_extension_assignments a join public.mphone_identities i on i.identity_uuid=a.identity_uuid
        where a.customer_uuid=${customerUuid}::uuid order by i.primary_email, a.created_at`
      const domainUuids = tenants.filter((row) => row.status === 'active').map((row) => row.fusion_domain_uuid)
      const domainExtensions = domainUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        domain_uuid::text, extension, effective_caller_id_name as display_name, enabled::text
        from v_extensions where domain_uuid=any(${domainUuids}::uuid[]) order by extension`
      const domainExtensionUuids = domainExtensions.map((row) => row.extension_uuid)
      const owners = domainExtensionUuids.length === 0 ? [] : await db`select extension_uuid::text,
        customer_uuid::text, status from public.mphone_customer_extensions
        where extension_uuid=any(${domainExtensionUuids}::uuid[]) and status='active'`
      const ownerMap = new Map(owners.map((row) => [row.extension_uuid, row.customer_uuid]))
      const extensionCandidates = domainExtensions.map((row) => ({ ...row,
        owner_customer_uuid: ownerMap.get(row.extension_uuid) ?? null }))
      const extensions = extensionCandidates.filter((row) => row.owner_customer_uuid === customerUuid)
      const exceptions = await db`select exception_uuid::text, source_uuid::text, reason, details,
        created_at from public.mphone_identity_migration_exceptions
        where resolved_at is null and (details->>'customer_uuid'=${customerUuid} or
          source_uuid in (select assignment_uuid from public.mphone_extension_assignments where customer_uuid=${customerUuid}::uuid))
        order by created_at desc`
      return json({ customers, memberships, tenants, assignments, extensions,
        extension_candidates: extensionCandidates, exceptions })
    }

    if (action === 'user_statuses') {
      const fusionUserUuids = Array.isArray(body.fusion_user_uuids)
        ? body.fusion_user_uuids.filter(isUuid).slice(0, 100) : []
      if (fusionUserUuids.length === 0) return json({ users: [] })
      const rows = await db`select legacy_fusion_user_uuid::text as fusion_user_uuid,
        identity_uuid::text, status, email_verified_at is not null as email_verified
        from public.mphone_identities
        where legacy_fusion_user_uuid=any(${fusionUserUuids}::uuid[])`
      return json({ users: rows })
    }

    if (action === 'invite_fusion_user') {
      const fusionUserUuid = body.fusion_user_uuid
      if (!isUuid(fusionUserUuid)) return json({ error: 'invalid_request' }, 400)
      const users = await fusion`select user_uuid::text, domain_uuid::text, username,
        lower(btrim(user_email)) as user_email, user_enabled::text
        from v_users where user_uuid=${fusionUserUuid}::uuid limit 1`
      const user = users[0]
      if (!user || user.user_enabled !== 'true') return json({ error: 'fusion_user_unavailable' }, 404)
      if (!validEmail(user.user_email ?? '')) return json({ error: 'fusion_user_email_required' }, 409)
      const linked = await db`select identity_uuid::text, status from public.mphone_identities
        where legacy_fusion_user_uuid=${fusionUserUuid}::uuid limit 1`
      if (linked.length > 0) return json({ error: 'mphone_account_exists', status: linked[0].status }, 409)
      const fusionExtensions = await fusion`select e.extension_uuid::text, e.domain_uuid::text
        from v_extension_users eu join v_extensions e on e.extension_uuid=eu.extension_uuid
        where eu.user_uuid=${fusionUserUuid}::uuid and e.enabled::text='true'`
      const tenants = await db`select tenant_uuid::text, fusion_domain_uuid::text
        from public.mphone_login_tenants where fusion_domain_uuid=${user.domain_uuid}::uuid
          and enabled=true order by created_at limit 1`
      if (tenants.length !== 1) return json({ error: 'login_tenant_not_found' }, 409)
      const tenant = tenants[0]
      const customerCode = `fusion_${fusionUserUuid.replaceAll('-', '').slice(0, 16)}`
      const created = await db.begin(async (transaction) => {
        const emailConflict = await transaction`select identity_uuid::text from public.mphone_identities
          where primary_email=${user.user_email} for update`
        if (emailConflict.length > 0) throw new Error('identity_conflict')
        const customers = await transaction`insert into public.mphone_customers
          (customer_code, display_name, customer_type, status, origin_system, updated_at)
          values (${customerCode}, ${user.username}, 'individual', 'active', 'fusion', now())
          on conflict (customer_code) do update set display_name=excluded.display_name,
            status='active', updated_at=now() returning customer_uuid::text`
        const customerUuid = customers[0].customer_uuid
        await transaction`insert into public.mphone_customer_tenants
          (customer_uuid, tenant_uuid, status, updated_at)
          values (${customerUuid}::uuid, ${tenant.tenant_uuid}::uuid, 'active', now())
          on conflict (customer_uuid, tenant_uuid) do update set status='active', updated_at=now()`
        const identities = await transaction`insert into public.mphone_identities
          (primary_email, status, legacy_fusion_user_uuid, email_verified_at)
          values (${user.user_email}, 'pending', ${fusionUserUuid}::uuid, null)
          returning identity_uuid::text`
        const identityUuid = identities[0].identity_uuid
        await transaction`insert into public.mphone_identity_providers
          (identity_uuid, provider, provider_subject, provider_email)
          values (${identityUuid}::uuid, 'password', ${user.user_email}, ${user.user_email})`
        await transaction`insert into public.mphone_memberships
          (customer_uuid, identity_uuid, role, status)
          values (${customerUuid}::uuid, ${identityUuid}::uuid, 'owner', 'invited')`
        await transaction`insert into public.mphone_integration_outbox
          (provider, event_type, customer_uuid, payload)
          values ('odoo', 'customer.created', ${customerUuid}::uuid,
            ${transaction.json({ customer_uuid: customerUuid, customer_code: customerCode,
              display_name: user.username, customer_type: 'individual', origin_system: 'fusion' })})`
        for (const extension of fusionExtensions) {
          const currentUsers = await fusion`select distinct eu.user_uuid::text
            from v_extension_users eu join v_users u on u.user_uuid=eu.user_uuid
            where eu.extension_uuid=${extension.extension_uuid}::uuid and u.user_enabled::text='true'`
          if (currentUsers.length === 1 && currentUsers[0].user_uuid === fusionUserUuid) {
            await transaction`update public.mphone_extension_assignments
              set status='removed', can_use=false, can_manage=false, updated_at=now()
              where extension_uuid=${extension.extension_uuid}::uuid and identity_uuid<>${identityUuid}::uuid
                and status='active'`
            await transaction`insert into public.mphone_customer_extensions
              (customer_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid, status, updated_at)
              values (${customerUuid}::uuid, ${tenant.tenant_uuid}::uuid, ${extension.domain_uuid}::uuid,
                ${extension.extension_uuid}::uuid, 'active', now())
              on conflict (extension_uuid) do update set customer_uuid=excluded.customer_uuid,
                tenant_uuid=excluded.tenant_uuid, fusion_domain_uuid=excluded.fusion_domain_uuid,
                status='active', updated_at=now()`
          } else {
            const owner = await transaction`select customer_uuid::text, tenant_uuid::text,
              fusion_domain_uuid::text from public.mphone_customer_extensions
              where extension_uuid=${extension.extension_uuid}::uuid and status='active' limit 1`
            if (owner.length !== 1 || owner[0].customer_uuid !== customerUuid) throw new Error('customer_assignment_ambiguous')
          }
          await transaction`insert into public.mphone_extension_assignments
            (customer_uuid, identity_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid,
              can_use, can_manage, status)
            values (${customerUuid}::uuid, ${identityUuid}::uuid, ${tenant.tenant_uuid}::uuid,
              ${extension.domain_uuid}::uuid, ${extension.extension_uuid}::uuid,
              true, true, 'active')
            on conflict (customer_uuid, identity_uuid, extension_uuid) do update set
              tenant_uuid=excluded.tenant_uuid, fusion_domain_uuid=excluded.fusion_domain_uuid,
              can_use=true, can_manage=true, status='active', updated_at=now()`
        }
        return { identityUuid, customerUuid }
      })
      const emailResponse = await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/functions/v1/mphone-identity-email/request-verification`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.user_email }),
      })
      await audit(emailResponse.ok ? 'accepted' : 'failed', 'identity', created.identityUuid,
        { customer_uuid: created.customerUuid, fusion_user_uuid: fusionUserUuid,
          assigned_extensions: fusionExtensions.length, email_delivery: emailResponse.status })
      if (!emailResponse.ok) return json({ error: 'delivery_failed' }, 503)
      return json({ invited: true, identity_uuid: created.identityUuid }, 200)
    }

    if (action === 'resend_fusion_user') {
      const fusionUserUuid = body.fusion_user_uuid
      if (!isUuid(fusionUserUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db`select identity_uuid::text, primary_email, status,
        email_verified_at is not null as email_verified
        from public.mphone_identities where legacy_fusion_user_uuid=${fusionUserUuid}::uuid limit 1`
      const identity = rows[0]
      if (!identity) return json({ error: 'mphone_account_not_found' }, 404)
      if (identity.status === 'disabled') return json({ error: 'mphone_account_disabled' }, 409)
      if (identity.status === 'active') {
        await audit('accepted', 'identity', identity.identity_uuid,
          { fusion_user_uuid: fusionUserUuid, delivery_action: 'not_required' })
        return json({ resent: false, email_sent: false, already_active: true }, 200)
      }
      const endpoint = 'request-verification'
      const response = await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/functions/v1/mphone-identity-email/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identity.primary_email }),
      })
      await audit(response.ok ? 'accepted' : 'failed', 'identity', identity.identity_uuid,
        { fusion_user_uuid: fusionUserUuid, delivery_action: endpoint, email_delivery: response.status })
      if (!response.ok) return json({ error: 'delivery_failed' }, 503)
      return json({ resent: true }, 200)
    }

    if (action === 'invite_identity') {
      const customerUuid = body.customer_uuid
      const fusionUserUuid = body.fusion_user_uuid
      const extensionUuid = body.extension_uuid
      const email = canonicalEmail(body.email)
      const role = typeof body.role === 'string' ? body.role : ''
      if (!isUuid(customerUuid) || !isUuid(fusionUserUuid) || !validEmail(email) ||
        !['owner', 'customer_admin', 'member'].includes(role) ||
        (extensionUuid && !isUuid(extensionUuid))) return json({ error: 'invalid_request' }, 400)
      const users = await fusion`select user_uuid::text, domain_uuid::text, user_enabled::text
        from v_users where user_uuid=${fusionUserUuid}::uuid limit 1`
      if (users.length !== 1 || users[0].user_enabled !== 'true') return json({ error: 'fusion_user_unavailable' }, 404)
      const customerTenants = await db`select t.tenant_uuid::text, t.fusion_domain_uuid::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t
          on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where ct.customer_uuid=${customerUuid}::uuid and ct.status='active'`
      if (!customerTenants.some((row) => row.fusion_domain_uuid === users[0].domain_uuid)) {
        return json({ error: 'fusion_user_outside_customer' }, 403)
      }
      let assignmentContext: { tenant_uuid: string; fusion_domain_uuid: string } | undefined
      if (extensionUuid) {
        const ownership = await db`select tenant_uuid::text, fusion_domain_uuid::text
          from public.mphone_customer_extensions where customer_uuid=${customerUuid}::uuid
            and extension_uuid=${extensionUuid}::uuid and status='active' limit 1`
        const extensions = await fusion`select extension_uuid::text, domain_uuid::text, enabled::text
          from v_extensions where extension_uuid=${extensionUuid}::uuid limit 1`
        if (ownership.length !== 1 || extensions.length !== 1 || extensions[0].enabled !== 'true' ||
          ownership[0].fusion_domain_uuid !== extensions[0].domain_uuid) {
          return json({ error: 'extension_outside_customer' }, 403)
        }
        assignmentContext = ownership[0]
      }
      const created = await db.begin(async (transaction) => {
        await transaction`select pg_advisory_xact_lock(hashtextextended(${customerUuid}, 0))`
        const conflicts = await transaction`select identity_uuid::text, primary_email, status,
          legacy_fusion_user_uuid::text from public.mphone_identities
          where primary_email=${email} or legacy_fusion_user_uuid=${fusionUserUuid}::uuid for update`
        if (conflicts.some((row) => row.primary_email !== email ||
          (row.legacy_fusion_user_uuid && row.legacy_fusion_user_uuid !== fusionUserUuid))) {
          throw new Error('identity_conflict')
        }
        const identities = conflicts.length > 0 ? conflicts : await transaction`
          insert into public.mphone_identities
            (primary_email, status, legacy_fusion_user_uuid, email_verified_at)
          values (${email}, 'pending', ${fusionUserUuid}::uuid, null)
          returning identity_uuid::text, primary_email, status, legacy_fusion_user_uuid::text`
        const identityUuid = identities[0].identity_uuid
        const membershipStatus = identities[0].status === 'active' ? 'active' : 'invited'
        const otherMembers = await transaction`select count(*)::int as count from public.mphone_memberships
          where customer_uuid=${customerUuid}::uuid and identity_uuid<>${identityUuid}::uuid
            and status<>'removed'`
        const effectiveRole = otherMembers[0].count === 0 ? 'owner' : role
        await transaction`update public.mphone_identities set legacy_fusion_user_uuid=${fusionUserUuid}::uuid,
          updated_at=now() where identity_uuid=${identityUuid}::uuid`
        await transaction`insert into public.mphone_identity_providers
          (identity_uuid, provider, provider_subject, provider_email)
          values (${identityUuid}::uuid, 'password', ${email}, ${email})
          on conflict (identity_uuid, provider) do update set provider_subject=excluded.provider_subject,
            provider_email=excluded.provider_email`
        await transaction`insert into public.mphone_memberships
          (customer_uuid, identity_uuid, role, status, updated_at)
          values (${customerUuid}::uuid, ${identityUuid}::uuid, ${effectiveRole}, ${membershipStatus}, now())
          on conflict (customer_uuid, identity_uuid) do update set role=excluded.role,
            status=case when public.mphone_memberships.status='active' then 'active' else 'invited' end,
            updated_at=now()`
        if (extensionUuid && assignmentContext) {
          await transaction`insert into public.mphone_extension_assignments
            (customer_uuid, identity_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid,
              can_use, can_manage, status, updated_at)
            values (${customerUuid}::uuid, ${identityUuid}::uuid, ${assignmentContext.tenant_uuid}::uuid,
              ${assignmentContext.fusion_domain_uuid}::uuid, ${extensionUuid}::uuid,
              ${body.can_use === true}, ${body.can_manage === true}, 'active', now())
            on conflict (customer_uuid, identity_uuid, extension_uuid) do update set
              can_use=excluded.can_use, can_manage=excluded.can_manage, status='active', updated_at=now()`
        }
        return { identityUuid, identityStatus: identities[0].status, effectiveRole }
      })
      if (created.identityStatus === 'active') {
        await audit('accepted', 'identity', created.identityUuid,
          { customer_uuid: customerUuid, fusion_user_uuid: fusionUserUuid, email_delivery: 'not_required' })
        return json({ invited: true, identity_uuid: created.identityUuid, email_sent: false, already_active: true }, 200)
      }
      const emailResponse = await fetch(`${env('SUPABASE_URL').replace(/\/+$/, '')}/functions/v1/mphone-identity-email/request-verification`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      })
      await audit(emailResponse.ok ? 'accepted' : 'failed', 'identity', created.identityUuid,
        { customer_uuid: customerUuid, fusion_user_uuid: fusionUserUuid, email_delivery: emailResponse.status })
      if (!emailResponse.ok) return json({ error: 'delivery_failed', identity_uuid: created.identityUuid }, 503)
      return json({ invited: true, identity_uuid: created.identityUuid }, 200)
    }

    if (action === 'claim_extension') {
      const customerUuid = body.customer_uuid
      const extensionUuid = body.extension_uuid
      if (!isUuid(customerUuid) || !isUuid(extensionUuid)) return json({ error: 'invalid_request' }, 400)
      const contexts = await db`select t.tenant_uuid::text, t.fusion_domain_uuid::text
        from public.mphone_customer_tenants ct join public.mphone_login_tenants t
          on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        where ct.customer_uuid=${customerUuid}::uuid and ct.status='active'`
      const domains = contexts.map((row) => row.fusion_domain_uuid)
      const extension = domains.length === 0 ? [] : await fusion`select extension_uuid::text,
        domain_uuid::text from v_extensions where extension_uuid=${extensionUuid}::uuid
          and domain_uuid=any(${domains}::uuid[]) and enabled::text='true' limit 1`
      if (extension.length !== 1) return json({ error: 'extension_outside_customer_tenant' }, 403)
      const existing = await db`select customer_uuid::text from public.mphone_customer_extensions
        where extension_uuid=${extensionUuid}::uuid and status='active' limit 1`
      if (existing.length > 0 && existing[0].customer_uuid !== customerUuid) {
        await audit('rejected', 'extension', extensionUuid, { reason: 'owned_by_another_customer' })
        return json({ error: 'owned_by_another_customer' }, 409)
      }
      const context = contexts.find((row) => row.fusion_domain_uuid === extension[0].domain_uuid)
      await db`insert into public.mphone_customer_extensions
        (customer_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid, status, updated_at)
        values (${customerUuid}::uuid, ${context.tenant_uuid}::uuid, ${context.fusion_domain_uuid}::uuid,
          ${extensionUuid}::uuid, 'active', now())
        on conflict (extension_uuid) do update set customer_uuid=excluded.customer_uuid,
          tenant_uuid=excluded.tenant_uuid, fusion_domain_uuid=excluded.fusion_domain_uuid,
          status='active', updated_at=now()`
      await audit('accepted', 'extension', extensionUuid, { customer_uuid: customerUuid, ownership: 'active' })
      return json({ claimed: true })
    }

    if (action === 'save_assignment') {
      const customerUuid = body.customer_uuid
      const identityUuid = body.identity_uuid
      const extensionUuid = body.extension_uuid
      if (!isUuid(customerUuid) || !isUuid(identityUuid) || !isUuid(extensionUuid)) return json({ error: 'invalid_request' }, 400)
      const contexts = await db`select t.tenant_uuid::text, t.fusion_domain_uuid::text
        from public.mphone_memberships m
        join public.mphone_customer_tenants ct on ct.customer_uuid=m.customer_uuid and ct.status='active'
        join public.mphone_login_tenants t on t.tenant_uuid=ct.tenant_uuid and t.enabled=true
        join public.mphone_identities i on i.identity_uuid=m.identity_uuid and i.status='active'
        where m.customer_uuid=${customerUuid}::uuid and m.identity_uuid=${identityUuid}::uuid
          and m.status='active'`
      if (contexts.length === 0) { await audit('rejected', 'extension', extensionUuid, { reason: 'invalid_membership' }); return json({ error: 'invalid_membership' }, 403) }
      const ownership = await db`select tenant_uuid::text, fusion_domain_uuid::text
        from public.mphone_customer_extensions where customer_uuid=${customerUuid}::uuid
          and extension_uuid=${extensionUuid}::uuid and status='active' limit 1`
      if (ownership.length !== 1) { await audit('rejected', 'extension', extensionUuid, { reason: 'extension_outside_customer' }); return json({ error: 'extension_outside_customer' }, 403) }
      const domains = contexts.map((row) => row.fusion_domain_uuid)
      const extension = await fusion`select extension_uuid::text, domain_uuid::text from v_extensions
        where extension_uuid=${extensionUuid}::uuid and domain_uuid=any(${domains}::uuid[]) and enabled::text='true' limit 1`
      if (extension.length !== 1) { await audit('rejected', 'extension', extensionUuid, { reason: 'extension_outside_customer' }); return json({ error: 'extension_outside_customer' }, 403) }
      const context = contexts.find((row) => row.fusion_domain_uuid === extension[0].domain_uuid)
      if (!context || ownership[0].tenant_uuid !== context.tenant_uuid || ownership[0].fusion_domain_uuid !== context.fusion_domain_uuid) {
        await audit('rejected', 'extension', extensionUuid, { reason: 'ownership_context_mismatch' })
        return json({ error: 'extension_outside_customer' }, 403)
      }
      const enabled = body.can_use === true || body.can_manage === true
      const rows = await db`insert into public.mphone_extension_assignments
        (customer_uuid, identity_uuid, tenant_uuid, fusion_domain_uuid, extension_uuid, can_use, can_manage, status, updated_at)
        values (${customerUuid}::uuid, ${identityUuid}::uuid, ${context.tenant_uuid}::uuid,
          ${extension[0].domain_uuid}::uuid, ${extensionUuid}::uuid, ${enabled}, ${enabled}, 'active', now())
        on conflict (customer_uuid, identity_uuid, extension_uuid) do update set
          tenant_uuid=excluded.tenant_uuid, fusion_domain_uuid=excluded.fusion_domain_uuid,
          can_use=excluded.can_use, can_manage=excluded.can_manage, status='active', updated_at=now()
        returning assignment_uuid::text`
      await audit('accepted', 'assignment', rows[0].assignment_uuid, { customer_uuid: customerUuid, identity_uuid: identityUuid, extension_uuid: extensionUuid, can_use: enabled, can_manage: enabled })
      return json({ saved: true, assignment_uuid: rows[0].assignment_uuid })
    }

    if (action === 'remove_assignment') {
      const customerUuid = body.customer_uuid
      const assignmentUuid = body.assignment_uuid
      if (!isUuid(customerUuid) || !isUuid(assignmentUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db`update public.mphone_extension_assignments set status='removed',
        can_use=false, can_manage=false, updated_at=now()
        where assignment_uuid=${assignmentUuid}::uuid and customer_uuid=${customerUuid}::uuid
        returning assignment_uuid::text`
      if (rows.length !== 1) return json({ error: 'not_found' }, 404)
      await audit('accepted', 'assignment', assignmentUuid, { customer_uuid: customerUuid, status: 'removed' })
      return json({ removed: true })
    }

    if (action === 'reconcile') {
      const assignments = await db`select a.assignment_uuid::text, a.customer_uuid::text,
        a.extension_uuid::text, a.fusion_domain_uuid::text, a.tenant_uuid::text,
        exists(select 1 from public.mphone_memberships m where m.customer_uuid=a.customer_uuid
          and m.identity_uuid=a.identity_uuid and m.status='active') as membership_valid,
        exists(select 1 from public.mphone_customer_tenants ct where ct.customer_uuid=a.customer_uuid
          and ct.tenant_uuid=a.tenant_uuid and ct.status='active') as tenant_valid,
        exists(select 1 from public.mphone_customer_extensions ce where ce.customer_uuid=a.customer_uuid
          and ce.extension_uuid=a.extension_uuid and ce.status='active') as ownership_valid
        from public.mphone_extension_assignments a where a.status='active'`
      const extensionUuids = assignments.map((row) => row.extension_uuid)
      const valid = extensionUuids.length === 0 ? [] : await fusion`select extension_uuid::text,
        domain_uuid::text, enabled::text from v_extensions where extension_uuid=any(${extensionUuids}::uuid[])`
      const extensionMap = new Map(valid.map((row) => [row.extension_uuid, row]))
      const reasons = ['membership_inactive', 'customer_tenant_inactive', 'extension_ownership_missing',
        'extension_missing', 'extension_disabled', 'extension_domain_mismatch']
      await db`update public.mphone_identity_migration_exceptions set resolved_at=now()
        where source_type='extension_assignment' and reason=any(${reasons}::text[]) and resolved_at is null`
      let exceptionCount = 0
      for (const assignment of assignments) {
        const extension = extensionMap.get(assignment.extension_uuid)
        const reason = !assignment.membership_valid ? 'membership_inactive'
          : !assignment.tenant_valid ? 'customer_tenant_inactive'
          : !assignment.ownership_valid ? 'extension_ownership_missing'
          : !extension ? 'extension_missing' : extension.enabled !== 'true'
          ? 'extension_disabled' : extension.domain_uuid !== assignment.fusion_domain_uuid
          ? 'extension_domain_mismatch' : ''
        if (!reason) continue
        exceptionCount += 1
        await db`insert into public.mphone_identity_migration_exceptions
          (source_type, source_uuid, reason, details, resolved_at)
          values ('extension_assignment', ${assignment.assignment_uuid}::uuid, ${reason},
            ${db.json({ customer_uuid: assignment.customer_uuid, extension_uuid: assignment.extension_uuid })}, null)
          on conflict (source_type, source_uuid, reason) do update set details=excluded.details, resolved_at=null`
      }
      await audit('accepted', 'reconciliation', undefined, { checked: assignments.length, exceptions: exceptionCount })
      return json({ reconciled: true, checked: assignments.length, exceptions: exceptionCount })
    }

    if (action === 'provisioning_manage_list') {
      const controls = await db`select paused,reason,updated_by,updated_at::text
        from public.mphone_extension_provisioning_controls where control_key='global'`
      const operations = await db`select o.operation_uuid::text,o.customer_uuid::text,c.display_name,
        o.requested_quantity,o.status,o.attempts,o.max_attempts,o.next_attempt_at::text,
        o.lease_expires_at::text,o.started_at::text,o.completed_at::text,o.error_code,
        o.created_at::text,o.updated_at::text,o.operator_release_at::text,o.operator_release_reason,
        (exists(select 1 from public.mphone_subscription_activations a
          join public.mphone_billing_periods b on b.billing_period_uuid=a.billing_period_uuid
          where a.operation_uuid=o.operation_uuid and b.status='paid' and b.amount_paid=b.total_amount
            and b.bank_reference is not null)
        or exists(select 1 from public.mphone_subscription_change_activations a
          join public.mphone_billing_periods b on b.billing_period_uuid=a.billing_period_uuid
          where a.operation_uuid=o.operation_uuid and b.status='paid' and b.amount_paid=b.total_amount
            and b.bank_reference is not null)) as payment_verified,
        count(r.reservation_uuid)::int as reservation_count,
        count(r.reservation_uuid) filter(where r.status='provisioned')::int as provisioned_count,
        count(r.reservation_uuid) filter(where r.status='provisioning_failed')::int as failed_count
        from public.mphone_extension_reservation_operations o
        join public.mphone_customers c on c.customer_uuid=o.customer_uuid
        left join public.mphone_extension_number_reservations r on r.operation_uuid=o.operation_uuid
        group by o.operation_uuid,c.display_name order by o.created_at desc limit 200`
      const operationExtensions = operations.length ? await db`select r.operation_uuid::text,r.extension_uuid::text,
        exists(select 1 from public.mphone_customer_extensions ce where ce.customer_uuid=r.customer_uuid
          and ce.extension_uuid=r.extension_uuid and ce.status='active') as registry_active
        from public.mphone_extension_number_reservations r where r.operation_uuid=any(
          ${operations.map((row) => row.operation_uuid)}::uuid[]) and r.status='provisioned' and r.extension_uuid is not null` : []
      const operationFusion = operationExtensions.length ? await fusion`select extension_uuid::text,enabled::text
        from v_extensions where extension_uuid=any(${operationExtensions.map((row) => row.extension_uuid)}::uuid[])` : []
      const operationFusionMap = new Map(operationFusion.map((row) => [row.extension_uuid,row.enabled === 'true']))
      const readyOperations = operations.map((operation) => {
        const extensions = operationExtensions.filter((item) => item.operation_uuid === operation.operation_uuid)
        const inventoryReady = extensions.length === Number(operation.requested_quantity)
          && extensions.every((item) => item.registry_active && operationFusionMap.get(item.extension_uuid) === true)
        return { ...operation,registry_active_count:extensions.filter((item) => item.registry_active).length,
          fusion_enabled_count:extensions.filter((item) => operationFusionMap.get(item.extension_uuid) === true).length,
          ready_to_handoff:operation.status === 'completed' && inventoryReady }
      })
      const holds = await db`select h.customer_uuid::text,c.display_name,h.held,h.reason,
        h.expires_at::text,h.updated_by,h.updated_at::text
        from public.mphone_extension_provisioning_holds h
        join public.mphone_customers c on c.customer_uuid=h.customer_uuid
        where h.held and (h.expires_at is null or h.expires_at>now()) order by c.display_name`
      const blocks = await db`select b.block_prefix::text,b.customer_uuid::text,c.display_name,b.status,
        count(r.reservation_uuid)::int as allocated_count,b.allocated_at::text
        from public.mphone_extension_number_blocks b join public.mphone_customers c using(customer_uuid)
        left join public.mphone_extension_number_reservations r on r.block_prefix=b.block_prefix
        group by b.block_prefix,c.display_name order by b.block_prefix desc limit 200`
      const occupiedNumbers = await db`select o.extension_number,o.block_prefix::text,o.suffix::int,
        o.customer_uuid::text,c.display_name,o.ownership_status,
        cardinality(o.fusion_extension_uuids)::int as fusion_count,o.last_seen_at::text,o.updated_at::text
        from public.mphone_extension_occupied_numbers o
        left join public.mphone_customers c using(customer_uuid)
        order by o.block_prefix,o.suffix limit 2000`
      const customers = await db`select customer_uuid::text,display_name from public.mphone_customers
        where status<>'closed' order by display_name`
      const autoSettings = await db`select default_mode,soft_quantity_limit,hard_quantity_limit,updated_at::text
        from public.mphone_extension_auto_provisioning_settings where settings_key='global'`
      const autoPolicies = await db`select c.customer_uuid::text,c.display_name,
        coalesce(p.mode,g.default_mode) as mode,
        coalesce(p.max_quantity_per_operation,g.soft_quantity_limit)::int as max_quantity_per_operation,
        (p.customer_uuid is not null) as explicit_exception,p.reason,p.updated_by::text,p.updated_at::text,
        (select count(*)::int from public.mphone_extension_reconciliation_findings f
          where f.customer_uuid=c.customer_uuid and f.status='open' and f.severity='critical') as critical_findings,
        (select count(*)::int from public.mphone_customer_tenants ct join public.mphone_login_tenants t using(tenant_uuid)
          where ct.customer_uuid=c.customer_uuid and ct.status='active' and t.enabled) as active_tenant_count
        from public.mphone_customers c cross join public.mphone_extension_auto_provisioning_settings g
        left join public.mphone_extension_auto_provisioning_policies p using(customer_uuid)
        where c.status='active' and g.settings_key='global' order by c.display_name`
      const autoDecisions = await db`select d.decision_uuid::text,d.operation_uuid::text,d.customer_uuid::text,
        c.display_name,d.decision,d.reason_code,d.details,d.created_at::text
        from public.mphone_extension_auto_provisioning_decisions d join public.mphone_customers c using(customer_uuid)
        order by d.created_at desc limit 100`
      const reconciliationRuns = await db`select r.run_uuid::text,r.customer_uuid::text,c.display_name,r.status,
        r.checked_customers,r.finding_count,r.error_code,r.started_at::text,r.completed_at::text
        from public.mphone_extension_reconciliation_runs r left join public.mphone_customers c using(customer_uuid)
        order by r.started_at desc limit 30`
      const findings = await db`select f.finding_uuid::text,f.run_uuid::text,f.customer_uuid::text,c.display_name,
        f.finding_type,f.severity,f.status,f.extension_uuid::text,f.operation_uuid::text,f.details,
        f.first_seen_at::text,f.last_seen_at::text,f.resolved_at::text
        from public.mphone_extension_reconciliation_findings f join public.mphone_customers c using(customer_uuid)
        where f.status<>'resolved' order by case f.severity when 'critical' then 0 else 1 end,f.last_seen_at desc limit 300`
      const recoveries = await db`select i.item_uuid::text,i.schedule_uuid::text,i.customer_uuid::text,c.display_name,
        i.extension_uuid::text,i.extension_number,i.status,i.suspended_at::text,i.restored_at::text,
        s.operation_uuid::text,s.recovery_until::text,s.status as schedule_status
        from public.mphone_extension_reduction_items i
        join public.mphone_extension_reduction_schedules s using(schedule_uuid)
        join public.mphone_customers c on c.customer_uuid=i.customer_uuid
        where i.status in ('suspended','restored') order by coalesce(i.suspended_at,i.updated_at) desc limit 200`
      return json({ control: controls[0] ?? { paused: true, reason: 'missing_control' }, operations:readyOperations, holds, blocks,
        occupied_numbers:occupiedNumbers,
        customers, auto_settings:autoSettings[0], auto_policies:autoPolicies, auto_decisions:autoDecisions,
        reconciliation_runs: reconciliationRuns, findings, recoveries })
    }

    if (action === 'provisioning_auto_policy_update') {
      const customerUuid = body.customer_uuid
      const mode = body.mode
      const settings = await db`select soft_quantity_limit from public.mphone_extension_auto_provisioning_settings
        where settings_key='global'`
      const maxQuantity = Number(settings[0]?.soft_quantity_limit ?? 100)
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!isUuid(customerUuid) || !['manual','automatic'].includes(String(mode))
        || reason.length < 3 || reason.length > 500) return json({ error:'invalid_auto_provisioning_policy' },400)
      let savedMode = String(mode)
      if (mode === 'automatic') {
        await db`delete from public.mphone_extension_auto_provisioning_policies where customer_uuid=${customerUuid}::uuid`
      } else {
        const rows = await db`select public.mphone_set_extension_auto_provisioning_policy(
          ${customerUuid}::uuid,'manual',${maxQuantity},${operatorUserUuid}::uuid,${reason}) as mode`
        savedMode = rows[0].mode
      }
      await audit('accepted','auto_provisioning_policy',customerUuid,{ mode:savedMode,
        max_quantity_per_operation:maxQuantity,reason })
      return json({ saved:true,mode:savedMode })
    }

    if (action === 'provisioning_reconcile') {
      const requestedCustomer = body.customer_uuid
      if (requestedCustomer !== null && requestedCustomer !== undefined && requestedCustomer !== '' && !isUuid(requestedCustomer)) {
        return json({ error: 'invalid_request' }, 400)
      }
      const targets = requestedCustomer
        ? await db`select c.customer_uuid::text,c.display_name from public.mphone_customers c
            where c.customer_uuid=${requestedCustomer}::uuid and c.status<>'closed'`
        : await db`select distinct c.customer_uuid::text,c.display_name from public.mphone_customers c
            where c.status<>'closed' and (exists(select 1 from public.mphone_subscriptions s where s.customer_uuid=c.customer_uuid)
              or exists(select 1 from public.mphone_customer_extensions ce where ce.customer_uuid=c.customer_uuid))`
      if (requestedCustomer && targets.length !== 1) return json({ error: 'not_found' }, 404)
      const runRows = await db`insert into public.mphone_extension_reconciliation_runs(customer_uuid,started_by)
        values (${requestedCustomer || null}::uuid,${operatorUserUuid}::uuid) returning run_uuid::text`
      const runUuid = runRows[0].run_uuid
      if (requestedCustomer) await db`update public.mphone_extension_reconciliation_findings set status='resolved',
        resolved_at=now(),last_seen_at=now() where customer_uuid=${requestedCustomer}::uuid and status='open'`
      else await db`update public.mphone_extension_reconciliation_findings set status='resolved',
        resolved_at=now(),last_seen_at=now() where status='open'`
      let findingCount = 0
      for (const target of targets) {
        const customerUuid = target.customer_uuid
        const subscriptions = await db`select billable_quantity,status from public.mphone_subscriptions
          where customer_uuid=${customerUuid}::uuid and status in ('active','past_due','suspended')
          order by case status when 'active' then 0 else 1 end,updated_at desc limit 1`
        const registry = await db`select ce.extension_uuid::text,ce.fusion_domain_uuid::text,ce.status,
          r.extension_number,r.reservation_uuid::text from public.mphone_customer_extensions ce
          left join public.mphone_extension_number_reservations r on r.extension_uuid=ce.extension_uuid
          where ce.customer_uuid=${customerUuid}::uuid and ce.status in ('active','suspended')`
        const fusionRows = registry.length ? await fusion`select extension_uuid::text,domain_uuid::text,
          extension::text,enabled::text from v_extensions where extension_uuid=any(${registry.map((row) => row.extension_uuid)}::uuid[])` : []
        const fusionMap = new Map(fusionRows.map((row) => [row.extension_uuid, row]))
        const findingsToAdd: Array<Record<string, unknown>> = []
        const billable = Number(subscriptions[0]?.billable_quantity ?? 0)
        const activeCount = registry.filter((row) => row.status === 'active').length
        if (subscriptions.length && activeCount < billable) findingsToAdd.push({ type:'paid_under_provisioned', severity:'critical',
          key:`quantity:under:${billable}:${activeCount}`, details:{ billable_quantity:billable,active_inventory:activeCount } })
        if (subscriptions.length && activeCount > billable) findingsToAdd.push({ type:'active_over_billable', severity:'critical',
          key:`quantity:over:${billable}:${activeCount}`, details:{ billable_quantity:billable,active_inventory:activeCount } })
        for (const item of registry) {
          const actual = fusionMap.get(item.extension_uuid)
          if (!actual) findingsToAdd.push({ type:'registry_extension_missing',severity:'critical',key:`missing:${item.extension_uuid}`,
            extension_uuid:item.extension_uuid,details:{ extension_number:item.extension_number } })
          else if (actual.domain_uuid !== item.fusion_domain_uuid) findingsToAdd.push({ type:'registry_domain_mismatch',severity:'critical',
            key:`domain:${item.extension_uuid}`,extension_uuid:item.extension_uuid,
            details:{ expected_domain_uuid:item.fusion_domain_uuid,actual_domain_uuid:actual.domain_uuid } })
          else if ((item.status === 'active') !== (actual.enabled === 'true')) findingsToAdd.push({ type:'registry_enabled_mismatch',
            severity:'warning',key:`enabled:${item.extension_uuid}`,extension_uuid:item.extension_uuid,
            details:{ registry_status:item.status,fusion_enabled:actual.enabled } })
        }
        const extensionNumbers = registry.map((row) => row.extension_number).filter(Boolean)
        const duplicateNumbers = extensionNumbers.length ? await fusion`select extension::text,count(*)::int as duplicate_count,
          array_agg(domain_uuid::text order by domain_uuid::text) as domain_uuids from v_extensions
          where extension=any(${extensionNumbers}::text[]) group by extension having count(*)>1` : []
        for (const item of duplicateNumbers) findingsToAdd.push({ type:'duplicate_extension_number',severity:'critical',
          key:`duplicate:${item.extension}`,details:{ extension_number:item.extension,duplicate_count:item.duplicate_count,
            domain_uuids:item.domain_uuids } })
        const orphanReservations = await db`select r.reservation_uuid::text,r.extension_uuid::text,r.extension_number
          from public.mphone_extension_number_reservations r where r.customer_uuid=${customerUuid}::uuid
          and r.status='provisioned' and r.extension_uuid is not null and not exists
            (select 1 from public.mphone_customer_extensions ce where ce.customer_uuid=r.customer_uuid
              and ce.extension_uuid=r.extension_uuid and ce.status in ('active','suspended'))`
        for (const item of orphanReservations) findingsToAdd.push({ type:'reservation_without_registry',severity:'critical',
          key:`reservation:${item.reservation_uuid}`,extension_uuid:item.extension_uuid,
          details:{ reservation_uuid:item.reservation_uuid,extension_number:item.extension_number } })
        const stuckOps = await db`select operation_uuid::text,status,updated_at::text from public.mphone_extension_reservation_operations
          where customer_uuid=${customerUuid}::uuid and status in ('provisioning','retry_wait','provisioning_partial')
          and updated_at<now()-interval '15 minutes'`
        for (const item of stuckOps) findingsToAdd.push({ type:'stuck_provisioning',severity:'warning',key:`provisioning:${item.operation_uuid}`,
          operation_uuid:item.operation_uuid,details:{ status:item.status,updated_at:item.updated_at } })
        const overdue = await db`select schedule_uuid::text,operation_uuid::text,status,effective_date::text from public.mphone_extension_reduction_schedules
          where customer_uuid=${customerUuid}::uuid and ((status in ('scheduled','paid','queued') and effective_date<current_date)
            or (status='executing' and updated_at<now()-interval '15 minutes'))`
        for (const item of overdue) findingsToAdd.push({ type:item.status === 'executing'?'stuck_reduction':'overdue_reduction',
          severity:'critical',key:`reduction:${item.schedule_uuid}`,operation_uuid:item.operation_uuid,
          details:{ schedule_uuid:item.schedule_uuid,status:item.status,effective_date:item.effective_date } })
        for (const finding of findingsToAdd) {
          await db`insert into public.mphone_extension_reconciliation_findings
            (run_uuid,customer_uuid,finding_key,finding_type,severity,extension_uuid,operation_uuid,details)
            values (${runUuid}::uuid,${customerUuid}::uuid,${String(finding.key)},${String(finding.type)},
              ${String(finding.severity)},${finding.extension_uuid || null}::uuid,${finding.operation_uuid || null}::uuid,
              ${db.json(finding.details || {})})`
          findingCount += 1
        }
      }
      await db`update public.mphone_extension_reconciliation_runs set status='completed',checked_customers=${targets.length},
        finding_count=${findingCount},completed_at=now() where run_uuid=${runUuid}::uuid`
      await audit('accepted','reconciliation_run',runUuid,{ customer_uuid:requestedCustomer || null,
        checked_customers:targets.length,finding_count:findingCount })
      return json({ reconciled:true,run_uuid:runUuid,checked_customers:targets.length,finding_count:findingCount })
    }

    if (action === 'provisioning_recovery_restore') {
      const itemUuid = body.item_uuid
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!isUuid(itemUuid) || reason.length < 3 || reason.length > 500) return json({ error:'reason_required' },400)
      const prepared = await db`select * from public.mphone_restore_reduced_extension(
        ${itemUuid}::uuid,${operatorUserUuid}::uuid,${reason})`
      if (prepared.length !== 1) return json({ error:'extension_not_restorable' },409)
      const target = prepared[0]
      const current = await fusion`select enabled::text from v_extensions where extension_uuid=${target.extension_uuid}::uuid
        and domain_uuid=${target.fusion_domain_uuid}::uuid limit 1`
      if (current.length !== 1) return json({ error:'extension_not_found' },409)
      const changed = current[0].enabled !== 'true'
      if (changed) await fusion`update v_extensions set enabled=true,update_date=now()
        where extension_uuid=${target.extension_uuid}::uuid and domain_uuid=${target.fusion_domain_uuid}::uuid`
      try {
        const result = await db`select public.mphone_finish_reduced_extension_restore(
          ${itemUuid}::uuid,${operatorUserUuid}::uuid,${reason}) as status`
        await audit('accepted','extension_recovery',itemUuid,{ operation_uuid:target.operation_uuid,
          extension_uuid:target.extension_uuid,extension_number:target.extension_number,reason,status:result[0].status })
        return json({ restored:true,status:result[0].status })
      } catch (error) {
        if (changed) await fusion`update v_extensions set enabled=false,update_date=now()
          where extension_uuid=${target.extension_uuid}::uuid and domain_uuid=${target.fusion_domain_uuid}::uuid`
        throw error
      }
    }

    if (action === 'provisioning_finding_manual_review') {
      const findingUuid = body.finding_uuid
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!isUuid(findingUuid) || reason.length < 3 || reason.length > 500) return json({ error:'reason_required' },400)
      const rows = await db`update public.mphone_extension_reconciliation_findings set status='manual_review',
        details=details||${db.json({ operator_reason:reason,operator_uuid:operatorUserUuid })},last_seen_at=now()
        where finding_uuid=${findingUuid}::uuid and status='open' returning customer_uuid::text`
      if (rows.length !== 1) return json({ error:'invalid_request_status' },409)
      await audit('accepted','reconciliation_finding',findingUuid,{ decision:'manual_review',reason,
        customer_uuid:rows[0].customer_uuid })
      return json({ saved:true })
    }

    if (action === 'provisioning_global_update') {
      if (typeof body.paused !== 'boolean') return json({ error: 'invalid_request' }, 400)
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (reason.length < 3 || reason.length > 500) return json({ error: 'reason_required' }, 400)
      if (body.paused === false && body.confirmation !== 'ENABLE_OPERATOR_ONLY') {
        return json({ error: 'confirmation_required' }, 409)
      }
      const rows = await db`update public.mphone_extension_provisioning_controls set paused=${body.paused},
        reason=${reason},updated_by=${String(operatorUserUuid)},updated_at=now() where control_key='global'
        returning paused,reason,updated_by,updated_at::text`
      await audit('accepted', 'provisioning_control', undefined, { paused: body.paused, reason })
      return json({ saved: true, control: rows[0] })
    }

    if (action === 'provisioning_customer_hold') {
      const customerUuid = body.customer_uuid
      if (!isUuid(customerUuid) || typeof body.held !== 'boolean') return json({ error: 'invalid_request' }, 400)
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (body.held && (reason.length < 3 || reason.length > 500)) return json({ error: 'reason_required' }, 400)
      const customers = await db`select 1 from public.mphone_customers where customer_uuid=${customerUuid}::uuid limit 1`
      if (customers.length !== 1) return json({ error: 'not_found' }, 404)
      if (body.held) {
        const expiresAt = typeof body.expires_at === 'string' && body.expires_at ? body.expires_at : null
        await db`insert into public.mphone_extension_provisioning_holds
          (customer_uuid,held,reason,expires_at,updated_by) values
          (${customerUuid}::uuid,true,${reason},${expiresAt}::timestamptz,${String(operatorUserUuid)})
          on conflict(customer_uuid) do update set held=true,reason=excluded.reason,
            expires_at=excluded.expires_at,updated_by=excluded.updated_by,updated_at=now()`
      } else {
        await db`update public.mphone_extension_provisioning_holds set held=false,
          updated_by=${String(operatorUserUuid)},updated_at=now() where customer_uuid=${customerUuid}::uuid`
      }
      await audit('accepted', 'customer', customerUuid, { provisioning_hold: body.held, reason })
      return json({ saved: true })
    }

    if (action === 'provisioning_operation_retry') {
      const operationUuid = body.operation_uuid
      if (!isUuid(operationUuid)) return json({ error: 'invalid_request' }, 400)
      const rows = await db.begin(async (transaction) => {
        const current = await transaction`select operation_uuid::text,customer_uuid::text,status
          from public.mphone_extension_reservation_operations where operation_uuid=${operationUuid}::uuid for update`
        if (current.length !== 1 || !['retry_wait','provisioning_partial','manual_review','failed'].includes(current[0].status)) return []
        await transaction`update public.mphone_extension_number_reservations set status='reserved',
          last_error_code=null,last_error_at=null,updated_at=now()
          where operation_uuid=${operationUuid}::uuid and status='provisioning_failed'`
        return await transaction`update public.mphone_extension_reservation_operations set status='retry_wait',
          attempts=0,next_attempt_at=now(),lease_uuid=null,lease_expires_at=null,error_code=null,updated_at=now()
          where operation_uuid=${operationUuid}::uuid returning operation_uuid::text,customer_uuid::text,status`
      })
      if (rows.length !== 1) return json({ error: 'invalid_request_status' }, 409)
      await audit('accepted', 'provisioning_operation', operationUuid, { decision: 'retry', customer_uuid: rows[0].customer_uuid })
      return json({ queued: true })
    }

    if (action === 'provisioning_operation_release') {
      const operationUuid = body.operation_uuid
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!isUuid(operationUuid) || reason.length < 3 || reason.length > 500) return json({ error:'reason_required' },400)
      const rows = await db`select public.mphone_release_paid_extension_operation(
        ${operationUuid}::uuid,${operatorUserUuid}::uuid,${reason}) as status`
      await audit('accepted','provisioning_operation',operationUuid,{ decision:'release_paid_operation',reason,
        global_hold_unchanged:true })
      return json({ released:true,status:rows[0]?.status ?? 'released' })
    }

    if (action === 'provisioning_operation_manual_review') {
      const operationUuid = body.operation_uuid
      const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
      if (!isUuid(operationUuid) || reason.length < 3 || reason.length > 500) return json({ error: 'reason_required' }, 400)
      const rows = await db`update public.mphone_extension_reservation_operations set status='manual_review',
        lease_uuid=null,lease_expires_at=null,error_code='operator_manual_review',last_error_at=now(),updated_at=now()
        where operation_uuid=${operationUuid}::uuid and status in
          ('reserved','provisioning','retry_wait','provisioning_partial','failed')
        returning operation_uuid::text,customer_uuid::text`
      if (rows.length !== 1) return json({ error: 'invalid_request_status' }, 409)
      await db`insert into public.mphone_extension_provisioning_events
        (operation_uuid,event_type,result,error_code,details) values
        (${operationUuid}::uuid,'operator_manual_review','info','operator_manual_review',${db.json({ reason })})`
      await audit('accepted', 'provisioning_operation', operationUuid, { decision: 'manual_review', reason,
        customer_uuid: rows[0].customer_uuid })
      return json({ saved: true })
    }
    return json({ error: 'invalid_action' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const operationalConflict = ['extension_not_restorable','recovery_window_expired','extension_not_found',
      'restore_reason_required','operation_not_releasable','customer_provisioning_held','paid_evidence_missing',
      'release_reason_required'].find((code) => message.includes(code))
    if (operationalConflict) {
      try { await audit('rejected','extension_recovery',undefined,{ reason:operationalConflict }) } catch { /* best effort */ }
      return json({ error:operationalConflict }, operationalConflict === 'extension_not_found' ? 404 : 409)
    }
    if (error instanceof Error && ['identity_conflict', 'customer_assignment_ambiguous'].includes(error.message)) {
      try { await audit('rejected', 'identity', undefined, { reason: error.message }) } catch { /* best effort */ }
      return json({ error: error.message }, 409)
    }
    console.error('Customer admin failed', error)
    try { await audit('failed') } catch { /* audit must not hide the original failure */ }
    return json({ error: 'service_unavailable' }, 503)
  } finally {
    await Promise.allSettled([db.end({ timeout: 1 }), fusion.end({ timeout: 1 })])
  }
})
