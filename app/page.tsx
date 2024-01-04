import CategoryList from "./components/CategoryList";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-5xl text-center">Welcome to the Trivia App!</h1>
      <h2 className="text-xl my-7">Choose a category to get started</h2>
      <CategoryList />
    </main>
  );
}
