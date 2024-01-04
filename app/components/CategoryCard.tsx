"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: string;
  categoryImage: string;
}

function formatStringWithUnderscores(inputString: string): string {
  const formattedString = inputString.replace(/\s+/g, "_");
  const finalString = formattedString.replace(/&/g, "and");
  return finalString.toLowerCase();
}

const CategoryCard = ({ category, categoryImage }: CategoryCardProps) => {
  const selectedCategory = formatStringWithUnderscores(category);

  const openModal = () => {
    const modalElement = document.getElementById("difficulty_modal");
    if (modalElement instanceof HTMLDialogElement) {
      modalElement.showModal();
    }
  };

  const closeModal = () => {
    const modalElement = document.getElementById("difficulty_modal");
    if (modalElement instanceof HTMLDialogElement) {
      modalElement.close();
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-96">
      <div className="h-48 w-96 relative overflow-hidden">
        <Image className="rounded-t-lg overflow-hidden"
          src={categoryImage}
          alt={category}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="card-body p-6 flex-row justify-between">
        <h2 className="card-title">{category}</h2>
        <div className="card-actions justify-center">
          <button className="btn btn-outline text-xl" onClick={openModal}>
            Start Quiz
          </button>
        </div>
      </div>
      <dialog id="difficulty_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl mb-6">Select Difficulty:</h3>
          <div className="flex flex-col text-center gap-4">
            <Link
              href={`/quiz?category=${selectedCategory}&difficulties=easy`}
              passHref
            >
              <button className="text-xl btn w-full">Easy</button>
            </Link>
            <Link
              href={`/quiz?category=${selectedCategory}&difficulties=medium`}
              passHref
            >
              <button className="text-xl btn w-full">Medium</button>
            </Link>
            <Link
              href={`/quiz?category=${selectedCategory}&difficulties=hard`}
              passHref
            >
              <button className="text-xl btn w-full">Hard</button>
            </Link>
            <Link
              href={`/quiz?category=${selectedCategory}&difficulties=easy,medium,hard`}
              passHref
            >
              <button className="text-xl btn w-full">Mixed</button>
            </Link>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={closeModal}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CategoryCard;
