import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { OrganizationSetupWizard } from '../components/organization/setup/OrganizationSetupWizard';

export const CreateOrganization: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create New Organization" 
        backUrl="/organizations"
      />
      <OrganizationSetupWizard />
    </div>
  );
};