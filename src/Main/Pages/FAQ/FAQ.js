import React, { useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai'; // Importing FAQ icon
import './FAQ.css';

export const faqData = [
  {
    category: 'General',
    items: [
      {
        question: 'What legal services does AWS Legal Group offer?',
        answer:
          'AWS Legal Group offers legal representation in civil, criminal, family, arbitration, corporate, commercial, labor, and banking law matters.',
      },
      {
        question: 'Where are AWS Legal Group\'s offices located?',
        answer:
          'AWS Legal Group has offices in Abu Dhabi, Dubai, and Al Ain, serving clients across the UAE and internationally.',
      },
      {
        question: 'How can I contact AWS Legal Group for legal assistance?',
        answer:
          'You can contact us via the form on our website or email us directly at <a href="mailto:info@aws-legalgroup.com">info@aws-legalgroup.com</a>.',
      },
      {
        question: 'What are your office hours?',
        answer:
          'Our offices are open from Monday to Friday, 9:00 AM to 6:00 PM. We are closed on weekends and public holidays.',
      },
      {
        question: 'Can I schedule a free consultation?',
        answer:
          'We offer a free initial consultation for most of our legal services. Contact us to schedule an appointment.',
      },
      {
        question: 'Can I get legal advice remotely?',
        answer:
          'Yes, we offer remote consultations via phone or video conference, ensuring access to legal advice wherever you are.',
      },
      {
        question: 'Do you offer services in languages other than English?',
        answer:
          'Yes, we offer legal services in Arabic, English, and other languages. Please contact us to discuss your language preference.',
      },
      {
        question: 'How do I pay for legal services?',
        answer:
          'We offer various payment options, including hourly billing, fixed rates for certain services, and payment plans tailored to your needs.',
      },
    ],
  },
  {
    category: 'Legal Services',
    items: [
      {
        question: 'What types of disputes can be resolved through arbitration?',
        answer:
          'Arbitration is ideal for resolving commercial, contractual, and construction-related disputes outside of court with legally binding outcomes.',
      },
      {
        question: 'How long does the arbitration process typically take?',
        answer:
          'While timelines vary by case complexity, arbitration is generally faster than court litigation and provides more confidentiality.',
      },
      {
        question: 'Does AWS Legal Group handle banking disputes?',
        answer:
          'Yes, our team specializes in banking disputes, representing both financial institutions and individuals in complex cases.',
      },
      {
        question: 'What is the difference between mediation and arbitration?',
        answer:
          'Mediation is a non-binding process where a neutral third party helps parties negotiate a settlement. Arbitration is a binding process where an arbitrator makes a final decision on the dispute.',
      },
      {
        question: 'Can AWS Legal Group assist with contract disputes?',
        answer:
          'Yes, we handle various contract disputes, ensuring that your rights are protected and negotiating favorable resolutions.',
      },
      {
        question: 'What is the process of registering a trademark in the UAE?',
        answer:
          'We can assist with the trademark registration process, which involves filing an application with the UAE Ministry of Economy and conducting a trademark search to ensure its availability.',
      },
      {
        question: 'Can AWS Legal Group assist with debt recovery?',
        answer:
          'Yes, we assist businesses and individuals in recovering owed debts through negotiation, legal actions, and litigation when necessary.',
      },
    ],
  },
  {
    category: 'Family Law',
    items: [
      {
        question: 'What family law services does AWS Legal Group provide?',
        answer:
          'We handle divorce, custody, inheritance, and spousal disputes with a compassionate and professional approach.',
      },
      {
        question: 'Why should I hire a parental rights lawyer?',
        answer:
          'Hiring a parental rights lawyer ensures your legal rights as a parent are protected in custody, visitation, and child support cases.',
      },
      {
        question: 'Can you assist with child adoption cases?',
        answer:
          'Yes, we offer legal guidance and representation in child adoption cases, ensuring a smooth legal process.',
      },
      {
        question: 'How does AWS Legal Group approach divorce cases?',
        answer:
          'We handle divorce cases with sensitivity and care, guiding you through the legal process while protecting your rights and interests.',
      },
      {
        question: 'What factors influence child custody decisions?',
        answer:
          'Child custody decisions are based on the best interests of the child, considering factors such as the child’s age, health, emotional needs, and the parent-child relationship.',
      },
    ],
  },
  {
    category: 'Corporate & Commercial',
    items: [
      {
        question: 'Does AWS Legal Group assist with business setup in the UAE?',
        answer:
          'Yes, we provide full legal support for setting up businesses in the UAE, including licensing, contracts, and compliance.',
      },
      {
        question: 'What is the process for commercial debt collection?',
        answer:
          'Our legal team pursues debt recovery through negotiation, legal notices, and, if necessary, court litigation to protect your business interests.',
      },
      {
        question: 'Can you assist with trademark registration?',
        answer:
          'Yes, we provide legal services for trademark registration and protection, ensuring that your intellectual property rights are secured.',
      },
      {
        question: 'What should I know about business contracts in the UAE?',
        answer:
          'It is crucial to ensure that your business contracts comply with UAE laws. We can assist with drafting, reviewing, and enforcing contracts that protect your business interests.',
      },
      {
        question: 'Can AWS Legal Group help with mergers and acquisitions?',
        answer:
          'Yes, we assist with all aspects of mergers and acquisitions, including due diligence, negotiations, and regulatory compliance.',
      },
    ],
  },
  {
    category: 'Criminal Law',
    items: [
      {
        question: 'What criminal law services are offered by AWS Legal Group?',
        answer:
          'We represent clients in fraud, theft, assault, cybercrime, and drug-related offenses with a strong focus on protecting your legal rights.',
      },
      {
        question: 'What should I do if I am accused of a crime?',
        answer:
          'It is crucial to seek legal advice immediately. Our criminal defense team can provide guidance and represent you throughout the legal process.',
      },
      {
        question: 'How does AWS Legal Group defend clients in criminal cases?',
        answer:
          'We build strong defense strategies based on evidence, legal precedents, and in-depth case analysis to ensure the best possible outcome for our clients.',
      },
      {
        question: 'What are the penalties for a DUI offense in the UAE?',
        answer:
          'The penalties for driving under the influence (DUI) in the UAE include fines, license suspension, and potential imprisonment, depending on the severity of the offense.',
      },
      {
        question: 'Can AWS Legal Group assist with cybercrime cases?',
        answer:
          'Yes, we offer legal services for cybercrime cases, including hacking, online fraud, and data breaches, to ensure that your rights are protected and justice is served.',
      },
    ],
  },
  {
    category: 'Case Management Portal',
    items: [
      {
        question: 'How can I view the list of my active cases?',
        answer: 'Go to the "Master List" section from the dashboard to view all open cases along with details like case number, request number, case type, and status.',
      },
      {
        question: 'How do I search for a specific case?',
        answer: 'Use the search bar at the top of the Master List page to filter and find a specific case using keywords or case numbers.',
      },
      {
        question: 'How do I open detailed information about a case?',
        answer: 'Click on the dropdown under the "Action" column for the desired case and select "View Details" to open the full case information page.',
      },
      {
        question: 'What kind of information can I view under case details?',
        answer: 'You can view case number, request number, litigation stage, claimed amount, important dates, last decisions, and ascription description.',
      },
      {
        question: 'What does the "Status: قيد التحضير" mean in the case details?',
        answer: 'It means the case is currently under preparation and has not yet proceeded to the main hearing.',
      },
      {
        question: 'What can I do in the Case Details page?',
        answer: 'You can view various details by clicking on options like View Lawyer, View Folders, Parties Details, Exhibit Details, Document Details, Notices, and Petitions.',
      },
      {
        question: 'What is the "Next Session Date" and where can I find it?',
        answer: 'It’s the date of the next scheduled court session. You can find it in the "Dates" section on the Case Details page.',
      },
      {
        question: 'What does the "Last Decision" section show?',
        answer: 'It displays the most recent court decision or action taken on the case in Arabic, including instructions and session outcomes.',
      },
      {
        question: 'Why is my case detail page showing "Loading case details..."?',
        answer: 'This usually indicates a delay in fetching data. Please wait a few seconds or refresh the page.',
      },
      {
        question: 'Whom should I contact if the portal is not loading or displaying errors?',
        answer: 'Use the "Messages" or "Client Consultation" section from the sidebar to get in touch with the support or legal team.',
      },
    ],
  },
];

export default function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggle = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setActiveQuestion(activeQuestion === key ? null : key);
  };

  return (
    <div className="faq-screen">
      <div className="faq-card">
        <div className="faq-header">
          <h2 className="faq-title">
            <AiOutlineQuestionCircle className="faq-icon" />
            Frequently Asked Questions
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about our legal services. Can’t find the answer you’re looking for? Reach out to our support team.
          </p>
        </div>
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="faq-category">
            <h3 className="faq-category-title">{category.category}</h3>
            <div className="faq-list">
              {category.items.map((item, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`;
                return (
                  <div className="faq-item" key={key}>
                    <div
                      className={`faq-question ${activeQuestion === key ? 'active' : ''}`}
                      onClick={() => toggle(categoryIndex, questionIndex)}
                    >
                      <span>{item.question}</span>
                      <span className={`arrow ${activeQuestion === key ? 'open' : ''}`}>&#9660;</span>
                    </div>
                    {activeQuestion === key && (
                      <div
                        className="faq-answer"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
