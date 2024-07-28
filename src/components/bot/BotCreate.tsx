import React, { useState } from "react";

export interface modelStyle {
  id: string;
  category: any[];
  question: string;
  answer: string;
  keywords: any | null;
  intent: string;
  entities: any[];
  relatedFAQs: any[];
  answerQuality: {};
}

export const FAQForm = () => {
  const [formData, setFormData] = useState<modelStyle>({
    id: "",
    category: [],
    question: "",
    answer: "",
    keywords: "",
    intent: "",
    entities: [
      {
        type: "",
        value: "",
      },
    ],
    relatedFAQs: [],
    answerQuality: {
      userSatisfaction: 0,
      accuracy: 0,
      reliability: 0,
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (e: any) => {
    const keywords = e.target.value
      .split(",")
      .map((keyword: any) => keyword.trim());
    setFormData((prevState) => ({
      ...prevState,
      keywords,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
    // ここでデータを保存するロジックを追加する
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="category"
        >
          カテゴリー
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="question"
        >
          質問
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="question"
          name="question"
          value={formData.question}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="answer">
          回答
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="answer"
          name="answer"
          value={formData.answer}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="keywords"
        >
          キーワード
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="keywords"
          type="text"
          name="keywords"
          value={formData.keywords.join(", ")}
          onChange={handleKeywordsChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          保存
        </button>
      </div>
    </form>
  );
};
