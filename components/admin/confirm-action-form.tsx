"use client";

import type { FormEvent, ReactNode } from "react";

export function ConfirmActionForm({
  action,
  fields,
  confirmMessage,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string | number>;
  confirmMessage: string;
  children: ReactNode;
  className?: string;
}) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={onSubmit} className={className}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {children}
    </form>
  );
}
