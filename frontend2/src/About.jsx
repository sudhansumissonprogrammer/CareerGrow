import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Careers, Connecting Futures</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We are on a mission to bridge the gap between talent and opportunity. CareerGrow is the fastest-growing job portal for modern professionals.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Team collaboration" 
              className="rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Who We Are</h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded in 2024, CareerGrow started with a simple idea: job hunting shouldn't be a struggle. We believe that everyone deserves a career that aligns with their passion and skills.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our platform uses advanced AI matching to connect job seekers with companies that value their unique potential. Whether you're a fresh graduate or a seasoned executive, we're here to support your journey.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-600">50k+</h3>
                <p className="text-sm text-slate-500">Jobs Posted</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold text-blue-600">1M+</h3>
                <p className="text-sm text-slate-500">Daily Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
            <p className="text-slate-600 mt-2">The principles that guide everything we do.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Transparency", icon: "🔍", desc: "We believe in clear, honest communication between employers and candidates." },
              { title: "Innovation", icon: "💡", desc: "Constantly pushing boundaries to create better hiring experiences." },
              { title: "Inclusivity", icon: "🌍", desc: "Building a platform where opportunities are accessible to everyone." }
            ].map((value, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-2xl hover:bg-blue-50 transition duration-300">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            We are always looking for passionate individuals to join our team and help shape the future of recruitment.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_#ffffff] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
            View Open Positions
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;