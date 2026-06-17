/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectItem } from '../../types/os';

export const projectsConfig = {
  directory: 'content/projects',
  allowedFormats: ['.json', '.md'],
  loadingStrategy: 'dynamic-import',
};

// Ready for Phase 2 dynamic imports
export const emptyProjectList: ProjectItem[] = [];
