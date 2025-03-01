"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const categoriesList = [
  "Technology",
  "Health",
  "Finance",
  "Education",
  "Entertainment",
  "News",
  "Tutorials",
  "Projects",
  "Guides",
  "Tips",
];

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing your post here...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleNext = () => {
    if (
      (step === 1 && title && shortDescription) ||
      (step === 2 && selectedCategories.length > 0) ||
      (step === 3 && thumbnailUrl) ||
      (step === 4 && content.trim() !== "<p></p>")
    ) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories((prev) => [...prev, category]);
    }
    setCategorySearch("");
  };

  const handleCategoryRemove = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => alert("Post Created Successfully!"), 1500);
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto p-8 bg-gray-900 text-white rounded-xl shadow-lg relative">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-yellow-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {!isSubmitted ? (
        <>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 1: Title & Description</h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 mb-4 border border-yellow-500 rounded bg-gray-800 text-white"
              />
              <textarea
                placeholder="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full p-3 border border-yellow-500 rounded bg-gray-800 text-white h-24"
              ></textarea>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 2: Select Categories</h2>
              <input
                type="text"
                placeholder="Search Categories"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full p-3 border border-yellow-500 rounded bg-gray-800 text-white"
              />
              <div className="mt-2">
                {categoriesList
                  .filter((cat) =>
                    cat.toLowerCase().includes(categorySearch.toLowerCase())
                  )
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className="bg-gray-700 text-yellow-500 px-3 py-1 m-1 rounded-lg transition hover:bg-yellow-500 hover:text-black"
                    >
                      {cat}
                    </button>
                  ))}
              </div>
              <div className="mt-4">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="bg-yellow-500 text-black px-3 py-1 m-1 rounded-lg inline-flex items-center"
                  >
                    {cat}{" "}
                    <XMarkIcon
                      className="w-5 h-5 ml-1 cursor-pointer"
                      onClick={() => handleCategoryRemove(cat)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 3: Upload Thumbnail</h2>
              <input
                type="text"
                placeholder="Thumbnail URL"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full p-3 mb-4 border border-yellow-500 rounded bg-gray-800 text-white"
              />
              <img
                src={thumbnailUrl || "https://static.thenounproject.com/png/1765551-200.png"}
                alt="Thumbnail Preview"
                className="w-full h-60 object-cover rounded-lg border border-yellow-500"
              />
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Step 4: Write Content</h2>
              <div className="w-full p-3 border border-yellow-500 rounded bg-gray-800 text-white min-h-[250px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 text-yellow-500 rounded-lg transition hover:bg-yellow-500 hover:text-black"
              >
                Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!title || !shortDescription)) ||
                  (step === 2 && selectedCategories.length === 0) ||
                  (step === 3 && !thumbnailUrl) ||
                  (step === 4 && content.trim() === "<p></p>")
                }
                className={`px-6 py-3 rounded-lg transition ${
                  (step === 1 && (!title || !shortDescription)) ||
                  (step === 2 && selectedCategories.length === 0) ||
                  (step === 3 && !thumbnailUrl) ||
                  (step === 4 && content.trim() === "<p></p>")
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 text-black hover:bg-yellow-600"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg transition hover:bg-yellow-600"
              >
                Create Post
              </button>
            )}
          </div>
        </>
      ) : (
        <h2 className="text-3xl font-bold text-center text-green-500 mt-10">🎉 Post Created Successfully!</h2>
      )}
    </div>
  );
};

export default CreatePost;
