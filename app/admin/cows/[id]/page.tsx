import type { Metadata } from "next";
import CowDetailsEditor from "../../components/cow-details-editor";

export const metadata: Metadata = { title: "গরুর বিস্তারিত" };

export default async function AdminCowDetailsPage({ params }: PageProps<"/admin/cows/[id]">) {
  const { id } = await params;
  return <CowDetailsEditor id={id}/>;
}

