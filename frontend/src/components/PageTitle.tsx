import { useEffect } from "react";

export default function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} | Batch223 Network`;
  }, [title]);

  return null;
}