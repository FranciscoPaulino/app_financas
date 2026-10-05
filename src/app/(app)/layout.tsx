import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-5xl space-y-6 p-4 pb-16 sm:py-8">{children}</main>
    </>
  )
}
