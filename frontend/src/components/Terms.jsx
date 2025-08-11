import React from 'react';
import { Shield, Info, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Terms & Conditions</h1>
              <p className="text-blue-100 mt-1">Travel Planning App</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800">Data Accuracy Notice</h3>
              <p className="text-amber-700 text-sm mt-1">
                Destination information, hotel details, restaurant data, and other travel-related content 
                are sourced from third-party APIs. While we strive for accuracy, we cannot guarantee 
                that all information is 100% accurate or up-to-date.
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-sm text-gray-600 border-b pb-4">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <Section 
              title="1. Acceptance of Terms"
              content="By accessing and using this travel planning application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
            />

            <Section 
              title="2. Service Description"
              content="Our travel planning app provides tools and information to help users plan their trips, including destination recommendations, hotel and restaurant information, itinerary planning, and related travel services. All content is provided for informational purposes only."
            />

            <Section 
              title="3. Data Sources and Accuracy"
              content="We obtain destination information, hotel details, restaurant data, pricing, availability, and other travel-related content from various third-party APIs and data providers. While we make reasonable efforts to ensure accuracy, we cannot guarantee that all information is current, complete, or error-free. Users should verify critical information directly with service providers before making reservations or travel decisions."
            />

            <Section 
              title="4. User Responsibilities"
              content="Users are responsible for: (a) Providing accurate account information, (b) Maintaining the security of their account credentials, (c) Verifying all travel information independently, (d) Complying with all applicable laws and regulations, (e) Respecting intellectual property rights, and (f) Not using the service for any unlawful purposes."
            />

            <Section 
              title="5. Prohibited Uses"
              content="You may not use our service to: (a) Violate any local, state, national, or international law, (b) Transmit any harmful or malicious code, (c) Attempt to gain unauthorized access to our systems, (d) Interfere with or disrupt the service, (e) Engage in any form of harassment or abuse, or (f) Use automated systems to access the service without permission."
            />

            <Section 
              title="6. Privacy Policy"
              content="Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy."
            />

            <PrivacySection />

            <Section 
              title="8. Disclaimers"
              content="THE SERVICE IS PROVIDED 'AS IS' WITHOUT ANY WARRANTIES, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant that the service will be uninterrupted, error-free, or free of harmful components."
            />

            <Section 
              title="9. Limitation of Liability"
              content="IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE."
            />

            <Section 
              title="10. Indemnification"
              content="You agree to defend, indemnify, and hold us harmless from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use of the service or violation of these terms."
            />

            <Section 
              title="11. Third-Party Services"
              content="Our app may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services."
            />

            <Section 
              title="12. Modifications"
              content="We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service after any changes constitutes acceptance of the new terms."
            />

            <Section 
              title="13. Termination"
              content="We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these terms. Upon termination, your right to use the service will cease immediately."
            />

            
          </div>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p>© 2025 Travel Planning App. All rights reserved.</p>
            <p className="mt-2">
              By using this app, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
      <Info className="w-5 h-5 text-blue-600" />
      {title}
    </h2>
    <p className="text-gray-700 leading-relaxed pl-7">{content}</p>
  </div>
);

const PrivacySection = () => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
      <Info className="w-5 h-5 text-blue-600" />
      7. Privacy and Data Collection
    </h2>
    <div className="pl-7 space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Information We Collect:</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
          <li>Account information (name, email, preferences)</li>
          <li>Travel preferences and search history</li>
          <li>Usage data and analytics</li>
          <li>Device and browser information</li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-900 mb-2">How We Use Your Information:</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
          <li>To provide and improve our services</li>
          <li>To personalize your travel recommendations</li>
          <li>To communicate important updates</li>
          <li>To ensure security and prevent fraud</li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Data Sharing:</h3>
        <p className="text-gray-700">
          We do not sell your personal information. We may share data with trusted third-party 
          service providers who help us operate our app, always under strict confidentiality agreements.
        </p>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Your Rights:</h3>
        <p className="text-gray-700">
          You have the right to access, update, or delete your personal information. You may 
          also opt out of certain communications and data processing activities.
        </p>
      </div>
    </div>
  </div>
);

export default Terms;