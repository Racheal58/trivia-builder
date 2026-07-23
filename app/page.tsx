import QuestionForm from "@/components/QuestionForm";
// import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  return (
    <div
      className="
        min-h-screen
        bg-linear-to-br
        from-indigo-100
        via-white
        to-purple-100
        flex
        flex-col
        items-center
        justify-center
        p-6
      "
    >
      {/* <ThemeToggle /> */}
      <QuestionForm />

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>💜 Inspired by my best friend</p>
        <p className="mt-1">
          © {new Date().getFullYear()} • Built to make every trivia night a
          little easier.
        </p>
      </div>
    </div>
  );
}
