function isoHoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const mockProvider = {
  mode: 'mock',
  async getMissedCalls() {
    return { available: true, kpis: { open: 18, overdue: 5, called_back: 9, resolved: 24 }, rows: [] };
  },
  async getExtensions() {
    return {
      available: true,
      extensions: [
        {
          extension_uuid: 'preview-101',
          extension: '101',
          caller_id_name: 'Kinh doanh',
          registered: true,
          registered_devices: 2,
          registration_protocols: ['udp']
        },
        {
          extension_uuid: 'preview-102',
          extension: '102',
          caller_id_name: 'Chăm sóc khách hàng',
          registered: true,
          registered_devices: 1,
          registration_protocols: ['wss']
        },
        {
          extension_uuid: 'preview-103',
          extension: '103',
          caller_id_name: 'Kỹ thuật',
          registered: false,
          registered_devices: 0,
          registration_protocols: []
        }
      ]
    };
  },
  async getDashboard({ hours = 24, direction = '' } = {}) {
    return {
      available: true,
      statistics_available: true,
      scope: 'extensions',
      hours,
      direction,
      generated: new Date().toISOString(),
      totals: {
        calls: 128,
        answered: 97,
        answered_inbound: 61,
        answered_outbound: 31,
        missed: 14,
        unconnected: 17,
        inbound: 78,
        outbound: 42,
        local: 8,
        talk_seconds: 18640,
        average_talk_seconds: 192,
        average_wait_seconds: 11,
        answer_rate: 78.2,
        outbound_answer_rate: 73.8
      },
      previous: {
        calls: 114,
        answered: 82,
        missed: 18,
        talk_seconds: 16420,
        answer_rate: 74.4,
        outbound_answer_rate: 68.1
      },
      statuses: {
        answered: 97,
        missed: 14,
        no_answer: 8,
        busy: 4,
        voicemail: 2,
        cancelled: 2,
        failed: 1
      },
      hourly: [
        {
          bucket: isoHoursAgo(6),
          calls: 12,
          answered: 9,
          answered_inbound: 6,
          answered_outbound: 3,
          inbound: 8,
          outbound: 4,
          missed: 2,
          talk_seconds: 1680
        },
        {
          bucket: isoHoursAgo(5),
          calls: 16,
          answered: 13,
          answered_inbound: 8,
          answered_outbound: 5,
          inbound: 10,
          outbound: 6,
          missed: 1,
          talk_seconds: 2320
        },
        {
          bucket: isoHoursAgo(4),
          calls: 19,
          answered: 14,
          answered_inbound: 9,
          answered_outbound: 5,
          inbound: 12,
          outbound: 7,
          missed: 3,
          talk_seconds: 2540
        },
        {
          bucket: isoHoursAgo(3),
          calls: 14,
          answered: 11,
          answered_inbound: 7,
          answered_outbound: 4,
          inbound: 9,
          outbound: 5,
          missed: 1,
          talk_seconds: 2180
        },
        {
          bucket: isoHoursAgo(2),
          calls: 22,
          answered: 17,
          answered_inbound: 11,
          answered_outbound: 6,
          inbound: 14,
          outbound: 8,
          missed: 3,
          talk_seconds: 3020
        },
        {
          bucket: isoHoursAgo(1),
          calls: 25,
          answered: 19,
          answered_inbound: 12,
          answered_outbound: 7,
          inbound: 16,
          outbound: 9,
          missed: 2,
          talk_seconds: 3540
        },
        {
          bucket: new Date().toISOString(),
          calls: 20,
          answered: 14,
          answered_inbound: 8,
          answered_outbound: 6,
          inbound: 12,
          outbound: 8,
          missed: 2,
          talk_seconds: 3360
        }
      ],
      subscribers: [
        {
          number: '1900 232 460',
          queue_names: 'Chăm sóc khách hàng',
          calls: 46,
          talk_seconds: 7140,
          answer_rate: 87
        },
        {
          number: '028 7300 1688',
          queue_names: 'Kinh doanh',
          calls: 34,
          talk_seconds: 4860,
          answer_rate: 79.4
        },
        {
          number: '1800 6606',
          queue_names: 'Hỗ trợ kỹ thuật',
          calls: 25,
          talk_seconds: 3180,
          answer_rate: 76
        },
        {
          number: '028 7300 1689',
          queue_names: '',
          calls: 14,
          talk_seconds: 1560,
          answer_rate: 71.4
        },
        {
          number: '1900 232 461',
          queue_names: 'Khách hàng VIP',
          calls: 9,
          talk_seconds: 1900,
          answer_rate: 88.9
        }
      ],
      recent: [
        {
          uuid: 'preview-call-1',
          direction: 'inbound',
          caller_id_name: 'Nguyễn Minh Anh',
          caller_id_number: '0901234567',
          destination_number: '101',
          start_stamp: isoHoursAgo(0.2),
          duration: 214,
          billsec: 198,
          status: 'answered'
        },
        {
          uuid: 'preview-call-2',
          direction: 'outbound',
          caller_id_name: 'Phòng kinh doanh',
          caller_id_number: '102',
          destination_number: '02873001234',
          start_stamp: isoHoursAgo(0.8),
          duration: 46,
          billsec: 0,
          status: 'missed'
        },
        {
          uuid: 'preview-call-3',
          direction: 'local',
          caller_id_name: 'Hỗ trợ khách hàng',
          caller_id_number: '103',
          destination_number: '104',
          start_stamp: isoHoursAgo(1.5),
          duration: 153,
          billsec: 139,
          status: 'answered'
        }
      ]
    };
  }
};

export default mockProvider;
