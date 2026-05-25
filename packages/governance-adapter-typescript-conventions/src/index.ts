import { createGovernanceWorkspaceAdapter } from '@anarchitects/governance-adapter-typescript';

export const governanceWorkspaceAdapter = createGovernanceWorkspaceAdapter({
  discoveryConfig: {
    projects: [
      {
        pattern: 'apps/booking-api',
        name: 'booking-api',
        tags: ['domain:booking', 'layer:interface']
      },
      {
        pattern: 'packages/booking-interface',
        name: 'booking-interface',
        tags: ['domain:booking', 'layer:interface']
      },
      {
        pattern: 'packages/booking-application',
        name: 'booking-application',
        tags: ['domain:booking', 'layer:application']
      },
      {
        pattern: 'packages/booking-domain',
        name: 'booking-domain',
        tags: ['domain:booking', 'layer:domain']
      },
      {
        pattern: 'packages/booking-infrastructure',
        name: 'booking-infrastructure',
        tags: ['domain:booking', 'layer:infrastructure']
      },
      {
        pattern: 'packages/customer-domain',
        name: 'customer-domain',
        tags: ['domain:customer', 'layer:domain']
      },
      {
        pattern: 'packages/shared-kernel',
        name: 'shared-kernel',
        tags: ['domain:shared', 'layer:domain']
      }
    ]
  }
});

export default governanceWorkspaceAdapter;
