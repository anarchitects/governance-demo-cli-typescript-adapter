import { createGovernanceWorkspaceAdapter } from '@anarchitects/governance-adapter-typescript';

export const governanceWorkspaceAdapter = createGovernanceWorkspaceAdapter({
  discoveryConfig: {
    projects: [
      {
        pattern: 'apps/*-api',
        name: '{0}-api',
        tags: ['domain:{0}', 'layer:interface']
      },
      {
        pattern: 'packages/shared-kernel',
        name: 'shared-kernel',
        tags: ['domain:shared', 'layer:domain']
      },
      {
        pattern: 'packages/*-*',
        name: '{0}-{1}',
        tags: ['domain:{0}', 'layer:{1}']
      }
    ]
  }
});

export default governanceWorkspaceAdapter;
