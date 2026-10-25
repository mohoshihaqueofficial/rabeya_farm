"use client";

import Image from "next/image";
import { advisors as defaultAdvisors, advisorTones, type Advisor } from "@/data/advisors";
import { advisorsStorageKey, isLocalImage } from "@/data/homepage";
import { useStoredList } from "./use-stored-list";
import styles from "./advisors-showcase.module.css";

export default function AdvisorsShowcase() {
  const advisors = useStoredList<Advisor>(advisorsStorageKey, defaultAdvisors).filter(advisor => advisor.active !== false && typeof advisor.image === "string" && advisor.image !== "" && typeof advisor.name === "string");
  if (!advisors.length) return null;
  return <section className={styles.section} aria-labelledby="advisor-title">
    <div className={`shell ${styles.inner}`}>
      <header className={styles.heading}>
        <div>
          <p>Advisor Panel</p>
          <h2 id="advisor-title">আমাদের Advisor Panel<br/><em>এক লক্ষ্যেই এগিয়ে চলা।</em></h2>
        </div>
        <p>কৌশল, পরিচালনা, উদ্ভাবন ও মানুষের সঙ্গে সংযোগ—চারটি গুরুত্বপূর্ণ ক্ষেত্রে তাঁদের অভিজ্ঞতা রাবেয়া ফার্মের পথচলাকে আরও দৃঢ় করে।</p>
      </header>

      <div className={styles.journey}>
        {advisors.map((advisor, index) => <article className={`${styles.card} ${styles[advisorTones[index % advisorTones.length]]}`} key={advisor.id}>
          <span className={styles.marker} aria-hidden="true"><i /></span>
          <div className={styles.photo}>
            <Image src={advisor.image} alt={advisor.name} fill sizes="(max-width: 650px) 100vw, 25vw" unoptimized={isLocalImage(advisor.image)} />
          </div>
          <div className={styles.copy}>
            <span>{advisor.name}</span>
            <h3>{advisor.role}</h3>
            <p>{advisor.summary}</p>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
