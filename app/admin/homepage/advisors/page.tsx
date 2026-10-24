"use client";

import CollectionManager from "../../components/collection-manager";
import { advisors, type Advisor } from "@/data/advisors";
import { advisorsStorageKey } from "@/data/homepage";

export default function AdminAdvisorsPage() {
  return <CollectionManager<Advisor>
    title="Advisor Panel" description="হোমপেজের “আমাদের Advisor Panel” অংশের উপদেষ্টাদের ছবি ও পরিচয়।" formTitle="নতুন উপদেষ্টা যোগ করুন" photoLabel="উপদেষ্টার ছবি আপলোড"
    storageKey={advisorsStorageKey} initial={advisors} previewHref="/#advisor-title"
    fields={[
      { key: "name", label: "নাম", placeholder: "যেমন: ড. মাহমুদুল হাসান", required: true },
      { key: "role", label: "পদবি ও প্রতিষ্ঠান", placeholder: "যেমন: ম্যানেজিং ডিরেক্টর · গ্রিন হারভেস্ট", required: true },
      { key: "summary", label: "সংক্ষিপ্ত পরিচিতি", placeholder: "রাবেয়া ফার্মে তাঁর ভূমিকা", multiline: true, required: true },
    ]}
    makeItem={(values, image, id) => ({ id, image, name: values.name, role: values.role, summary: values.summary, tone: "green", active: true })}
    itemTitle={advisor => advisor.name} itemSubtitle={advisor => advisor.role}/>;
}
