# Chat F12 reference

Captured from `http://127.0.0.1:4323/apps/chat` before source changes on 2026-09-08.

## Left column

- Column width: `344px`.
- Header padding: `20px 16px 4px`.
- Search input vertical padding: `8px`.
- User list wrapper padding: `0`.
- User item padding: `8px 16px`.
- User item avatar slot: `64px` wide.
- User item divider: removed.
- User avatar: `48px × 48px`.
- Selected item background: `rgba(39, 139, 255, 0.08)`.
- User name: `16px`, weight `400`, line-height `24px`.
- Last-message time: `12px`, weight `400`, line-height `19.92px`.
- User role/status: `12px`, weight `300`, line-height `19.92px`.
- Bottom action wrapper padding: `0`.
- Bottom action item left padding: `24px`.
- Bottom profile padding: `8px 8px 8px 24px`.

## Right column

- Header user name: `h5` (`16px`, weight `600`).
- Horizontal chat-history padding: `20px` (`2.5 × spacing`).
- Header and message avatars: `48px × 48px`.
- Message bubble padding: `12px`.
- Message text: `14px`, weight `400`, line-height `21.98px`.
- Sent bubble background: `rgb(39, 139, 255)`.
- Received bubble background: `rgb(252, 252, 253)`.

## Border decision

- Remove the outer card border from both the left and right columns.
- Keep the left search field's divider-colored outline.
- Remove the separators from the right header and composer container.
- Remove the underline from the right message input.
