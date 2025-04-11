
import React from 'react';
import { PageLayout } from "@/components/layouts/PageLayout";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const PersonalInfo = () => {
  return (
    <PageLayout title="Profil">
      <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg shadow-lg p-4 md:p-6">
        <ProfileTabs />
      </div>
    </PageLayout>
  );
};

export default PersonalInfo;
