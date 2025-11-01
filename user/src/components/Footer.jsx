import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'

export default function Footer() {
  const [activeSection, setActiveSection] = useState(null)

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const sectionContent = {
    about: (
      <div className="space-y-4 mt-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2 text-white">Who We Are</h4>
          <p className="text-gray-400">JC Universe is a leading electronics retailer based in the UAE, specializing in premium consumer electronics and cutting-edge technology products. Since our establishment, we've been committed to bringing the latest innovations to tech enthusiasts across the region.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Our Mission</h4>
          <p className="text-gray-400">To provide customers with access to the world's best technology products at competitive prices, backed by exceptional customer service and expert guidance.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Why Choose JC Universe?</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Authentic products from authorized distributors</li>
            <li>Competitive pricing with regular deals and offers</li>
            <li>Expert customer support team</li>
            <li>Fast delivery across UAE</li>
            <li>Comprehensive warranty coverage</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Our Values</h4>
          <p className="text-gray-400">We believe in transparency, quality, and customer satisfaction. Every product we sell is carefully selected and verified for authenticity. Our team is dedicated to helping you make informed decisions about your technology purchases.</p>
        </div>
      </div>
    ),
    contact: (
      <div className="space-y-4 mt-4 text-sm">
        <div>
          <h4 className="font-semibold mb-2 text-white">Email</h4>
          <p className="text-gray-400">Contact@JCUniverse.in</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Phone</h4>
          <p className="text-gray-400">+971 4 XXX XXXX (UAE)</p>
          <p className="text-gray-400">Available 9 AM - 9 PM GST</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Address</h4>
          <p className="text-gray-400">JC Universe Electronics LLC</p>
          <p className="text-gray-400">Dubai, United Arab Emirates</p>
        </div>
      </div>
    ),
    returns: (
      <div className="space-y-4 mt-4 text-sm">
        <p className="text-gray-400">We offer a 14-day return policy for most products.</p>
        <div>
          <h4 className="font-semibold mb-2 text-white">Return Conditions</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Product must be unused and in original packaging</li>
            <li>All accessories and documentation included</li>
            <li>Proof of purchase required</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">How to Return</h4>
          <ol className="list-decimal list-inside text-gray-400 space-y-1">
            <li>Contact our support team</li>
            <li>Receive return authorization</li>
            <li>Ship the product back</li>
            <li>Refund processed within 5-7 business days</li>
          </ol>
        </div>
      </div>
    ),
    warranty: (
      <div className="space-y-4 mt-4 text-sm">
        <p className="text-gray-400">All products come with manufacturer's warranty plus JC Universe guarantee.</p>
        <div>
          <h4 className="font-semibold mb-2 text-white">Standard Warranty</h4>
          <p className="text-gray-400">1-year manufacturer warranty on all electronics</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Extended Warranty</h4>
          <p className="text-gray-400">Purchase extended warranty up to 3 years for eligible products</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">What's Covered</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Manufacturing defects</li>
            <li>Hardware malfunctions</li>
            <li>Parts replacement</li>
          </ul>
        </div>
      </div>
    ),
    terms: (
      <div className="space-y-4 mt-4 text-sm">
        <p className="text-gray-400">Last updated: November 2024</p>
        <div>
          <h4 className="font-semibold mb-2 text-white">1. Acceptance of Terms</h4>
          <p className="text-gray-400">By accessing and using JC Universe, you agree to be bound by these Terms and Conditions.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">2. Products & Pricing</h4>
          <p className="text-gray-400">All prices are listed in AED (UAE Dirham). We reserve the right to modify prices without prior notice.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">3. Orders & Payment</h4>
          <p className="text-gray-400">All orders are subject to availability and confirmation. Payment must be received before dispatch.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">4. Delivery</h4>
          <p className="text-gray-400">Delivery times are estimates and not guaranteed. Risk passes to buyer upon delivery.</p>
        </div>
      </div>
    ),
    privacy: (
      <div className="space-y-4 mt-4 text-sm">
        <p className="text-gray-400">Last updated: November 2024</p>
        <div>
          <h4 className="font-semibold mb-2 text-white">Information We Collect</h4>
          <p className="text-gray-400">We collect personal information including name, email, phone number, and shipping address when you make a purchase.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">How We Use Your Information</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Send promotional emails (with consent)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Data Security</h4>
          <p className="text-gray-400">We implement industry-standard security measures to protect your personal information.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Your Rights</h4>
          <p className="text-gray-400">You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
        </div>
      </div>
    ),
    refunds: (
      <div className="space-y-4 mt-4 text-sm">
        <p className="text-gray-400">We want you to be completely satisfied with your purchase.</p>
        <div>
          <h4 className="font-semibold mb-2 text-white">Refund Eligibility</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Products returned within 14 days of delivery</li>
            <li>Items in original, unused condition</li>
            <li>Original packaging and accessories included</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Refund Process</h4>
          <p className="text-gray-400">Refunds are processed in AED to the original payment method within 5-7 business days after we receive the returned item.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Non-Refundable Items</h4>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Opened software or digital products</li>
            <li>Custom-ordered items</li>
            <li>Sale or clearance items (unless defective)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-white">Shipping Costs</h4>
          <p className="text-gray-400">Original shipping charges are non-refundable. Return shipping costs are the customer's responsibility unless the item is defective.</p>
        </div>
      </div>
    )
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                JC Universe
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Your trusted destination for premium electronics and cutting-edge technology.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button 
                  onClick={() => toggleSection('about')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  About Us
                  {activeSection === 'about' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'about' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'about' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.about}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('contact')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Contact
                  {activeSection === 'contact' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'contact' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'contact' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.contact}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('privacy')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Privacy Policy
                  {activeSection === 'privacy' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'privacy' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'privacy' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.privacy}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('terms')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Terms & Conditions
                  {activeSection === 'terms' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'terms' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'terms' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.terms}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li>
                <button 
                  onClick={() => toggleSection('returns')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Return Policy
                  {activeSection === 'returns' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'returns' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'returns' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.returns}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('refunds')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Refund Policy
                  {activeSection === 'refunds' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'refunds' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'refunds' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.refunds}
                    </div>
                  )}
                </div>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('warranty')} 
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  Warranty Info
                  {activeSection === 'warranty' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                  activeSection === 'warranty' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {activeSection === 'warranty' && (
                    <div className="bg-gray-800 rounded-lg p-4 mt-2 border border-gray-700">
                      {sectionContent.warranty}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Expandable Content Area - Desktop Only */}
        <div className="mt-8 hidden lg:block">
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              activeSection ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {activeSection && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                {sectionContent[activeSection]}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-sm text-gray-400">&copy; {new Date().getFullYear()} JC Universe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}