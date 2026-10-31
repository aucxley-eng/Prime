import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const settings = getSettings();

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-1 text-3xl font-semibold">Site settings</h1>
        <p className="mt-2 text-sm text-ink/55">
          Contact details and viewing information shown across the public site.
        </p>
      </div>

      {params.saved === "1" ? (
        <p className="mt-5 rounded-xl bg-[#25d366]/15 px-4 py-3 text-sm font-semibold text-[#128c4b]">
          Settings saved.
        </p>
      ) : null}

      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
