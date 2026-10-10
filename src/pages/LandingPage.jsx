import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { eventService } from '../services/eventService';
import {
  Sparkles,
  HandHeart,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  SlidersHorizontal,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await eventService.getAllEvents();
        setFeaturedEvents(events.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-linear-to-b from-indigo-50/50 via-white to-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Next-Generation Social Impact Infrastructure</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Connect. Volunteer. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600">
                  Make an Impact.
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                VolunteerMatch uses AI to help organizations find suitable volunteers based on skills, interests, and event requirements.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/opportunities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/25 transition-all hover:shadow-lg"
                >
                  <HandHeart className="w-4 h-4" />
                  <span>Find Opportunities</span>
                </Link>
                <Link
                  to="/register?role=ORGANIZATION"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Create an Event</span>
                </Link>
              </div>

              {/* Assurance Callout */}
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Human-In-The-Loop: AI recommends, organizations make final selections.</span>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary/30 to-indigo-500/30 blur-xl opacity-70"></div>
                <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">AI Match Engine v2.0</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Live Event Match</p>
                        <p className="text-xs font-bold text-slate-800">Blood Donation Camp</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-primary rounded-full shadow-2xs">
                        10 Needed
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                          A
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Ananya Sharma</p>
                          <p className="text-[10px] text-slate-500">Communication • Registration Desk</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                          <Sparkles className="w-3 h-3" /> 91%
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-xs">
                          R
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Rahul Verma</p>
                          <p className="text-[10px] text-slate-500">Photography • Media Specialist</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          35%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <span className="text-[11px] font-semibold text-primary">
                        Organizations review candidates & make final selections →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Intelligent Process</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">How VolunteerMatch Works</h2>
            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Eliminating friction between community initiatives and passionate change-makers with AI-assisted recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Create Your Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Volunteers list skills, interests, and general availability. Organizations create official accounts.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Discover Opportunities</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organizations publish events with natural descriptions. Volunteers confirm actual availability and apply.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Finds Suitable Matches</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI extracts required skills and ranks volunteers with transparent scores and human-readable explanations.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left relative hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Make an Impact</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organizations review & make the final selection. Tasks are assigned, attendance recorded, and certificates issued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Volunteers & Organizations Split Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* For Volunteers */}
            <div id="for-volunteers" className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">For Volunteers</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Find meaningful community opportunities that match your specific talents. No spam, no mismatched roles.
                </p>
                <ul className="space-y-3 mb-8 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Confirm your actual availability for each event before applying</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Receive instant in-app alerts on selection and assigned tasks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download verified, official certificates of appreciation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Track full verified volunteer history and attendance records</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register?role=VOLUNTEER"
                className="inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* For Organizations */}
            <div id="for-organizations" className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">For Organizations</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Stop spending hours sorting through hundreds of unverified applicants. Let AI analyze your event scope.
                </p>
                <ul className="space-y-3 mb-8 text-xs font-medium text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI auto-extracts skills, tasks, and requirements from event descriptions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transparent match scores & why-recommended rationale</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full human control: organizations make the final selection decision</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>End-to-end task assignment, attendance tracking, and certificate issuance</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register?role=ORGANIZATION"
                className="inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors"
              >
                <span>Register Organization</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Matching Philosophy Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-primary text-xs font-bold mb-4">
            <Brain className="w-4 h-4" />
            <span>Ethical AI Architecture</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            AI-Powered Matching with Human In The Loop
          </h2>
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            "AI recommends suitable volunteers. Organizations always make the final selection."
            We deliberately reject black-box automated assignments. Our hybrid algorithm combines skill overlap (50%), interest alignment (25%), confirmed availability (15%), and location proximity (10%) to provide transparent, explainable recommendations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <SlidersHorizontal className="w-5 h-5 text-primary mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">Explainable Reasoning</h4>
              <p className="text-xs text-slate-600">Every match score is accompanied by a plain-English explanation of why the candidate was recommended.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <Target className="w-5 h-5 text-primary mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">Explicit Availability</h4>
              <p className="text-xs text-slate-600">Volunteers must actively verify their availability for each individual date and time prior to applying.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-primary mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1">Zero Auto-Selection</h4>
              <p className="text-xs text-slate-600">The organization always reviews candidate profiles and clicks 'Select' to approve participants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      {featuredEvents.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Causes</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Featured Volunteer Opportunities</h2>
              </div>
              <Link
                to="/opportunities"
                className="mt-4 sm:mt-0 text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>View all opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-linear-to-tr from-primary to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-base text-indigo-100 max-w-xl mx-auto leading-relaxed mb-8">
            Join hundreds of volunteers and impactful organizations driving social change through intelligent matching.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-primary bg-white hover:bg-slate-50 rounded-xl shadow-lg transition-colors"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white border border-white/30 hover:bg-white/10 rounded-xl transition-colors"
            >
              Log In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                <HandHeart className="w-5 h-5 text-primary" />
                <span>VolunteerMatch</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                AI-Powered Volunteer Matching System connecting community organizations with passionate change-makers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/opportunities" className="hover:text-white">Find Opportunities</Link></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><Link to="/register?role=ORGANIZATION" className="hover:text-white">For Organizations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Governance</h4>
              <ul className="space-y-2">
                <li><span className="text-slate-400">Human-In-The-Loop AI</span></li>
                <li><span className="text-slate-400">Privacy & Data Security</span></li>
                <li><span className="text-slate-400">Verified Certificates</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">College Project</h4>
              <p className="leading-relaxed text-slate-400">
                Full-stack web application built with React, Java Spring Boot, MySQL, and AI Integration.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500">
            © {new Date().getFullYear()} VolunteerMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
