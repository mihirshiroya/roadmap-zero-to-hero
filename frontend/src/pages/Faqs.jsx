import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFAQs } from '../Slicers/faqSlice';
import { ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';

export default function Faqs() {
  const dispatch = useDispatch();
  const { faqTopics, loading, error } = useSelector((state) => state.faq);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    dispatch(fetchFAQs());
  }, [dispatch]);

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) return <div>Loading FAQs...</div>;
  if (error) return <div className="text-error">Error: {error}</div>;

  if (!selectedTopic) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-primary mb-8">Frequently Asked Interview Question</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {faqTopics.map((topic) => (
            <button
              key={topic._id}
              onClick={() => setSelectedTopic(topic)}
              className="p-4 bg-surface hover:bg-surface/80 border border-color rounded-lg text-left transition-colors text-sm"
            >
              {topic.logo_url && (
                <img 
                  src={topic.logo_url}
                  alt={topic.topic}
                  className="mb-2 max-w-[30px] h-8 object-contain"
                />
              )}
              <h2 className="text-base font-medium text-primary">{topic.topic}</h2>
              <p className="text-xs text-secondary mt-1">
                {topic.questions.length} questions
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setSelectedTopic(null)}
          className="text-primary hover:text-primary/80 flex items-center gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {selectedTopic.logo_url && (
          <img 
            src={selectedTopic.logo_url}
            alt={selectedTopic.topic}
            className="h-8 w-8 object-contain ml-2"
          />
        )}
        <h1 className="text-2xl font-semibold text-primary">{selectedTopic.topic}</h1>
      </div>
      <div className="space-y-4">
        {selectedTopic.questions.map((qna, index) => (
          <div key={index} className="border rounded-lg overflow-hidden border-color">
            <button
              className="flex justify-between items-center w-full p-4 text-left bg-surface hover:bg-surface/80 transition-colors"
              onClick={() => toggleQuestion(index)}
            >
              <span className="font-medium text-primary">{qna.question}</span>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="p-4 bg-background">
                <p className="text-secondary">{qna.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 