import { useId } from "react";

export default function FilePicker({
  label,
  accept,
  value,
  onChangeName,
  onChangeFile,
}: {
  label: string;
  accept?: string;
  value?: string;
  onChangeName: (name: string) => void;
  onChangeFile?: (file: File | null) => void;
}) {
  const id = useId();
  const name = value?.trim() ? value : "No file chosen";

  return (
    <div>
      <p className="label">{label}</p>

      <div className="mt-2 flex items-center gap-3">
        <label
          htmlFor={id}
          className="h-10 px-5 rounded-pill bg-soft-cloud text-ink text-sm font-medium inline-flex items-center cursor-pointer border border-hairline-soft"
        >
          Choose File
        </label>

        <span className="text-sm text-mute truncate">{name}</span>

        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onChangeName(file ? file.name : "");
            onChangeFile?.(file);
          }}
        />
      </div>
    </div>
  );
}