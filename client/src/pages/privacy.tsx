import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
          
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            
            <div className="space-y-8 text-gray-200">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Information We Collect</h2>
                <p className="mb-4">
                  When you use our services, we may collect the following types of information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal information you provide (name, email address)</li>
                  <li>Information about your device and how you use our service</li>
                  <li>Communication preferences and feedback</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">How We Use Your Information</h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Communicate with you about updates and features</li>
                  <li>Improve our platform and user experience</li>
                  <li>Respond to your inquiries and support requests</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Information Sharing</h2>
                <p className="mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Your Rights</h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Contact us with questions about this policy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy, please contact us through our contact form or email us directly.
                </p>
              </section>

              <div className="mt-12 pt-8 border-t border-white/20 text-center text-gray-400">
                <p>Last Updated: August 5, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}