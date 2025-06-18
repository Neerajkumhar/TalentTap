import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

export default function Profile() {
  // Example user data (replace with real user data from your backend)
  const user = {
    name: "Dominick SH. Hong",
    headline: "Consultant & Trainer for Marketing | Brand Strategy | Growth Hacking | Customer Insights | Demand Generation",
    location: "Singapore",
    university: "City University of New York",
    connections: 54,
    // Using open source images as placeholders
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format", // Professional headshot placeholder
    coverUrl: "https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=1600&h=400&fit=crop&auto=format", // Sydney Opera House at sunset
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Cover Image and Edit Button */}
      <div className="relative h-[200px] md:h-[250px]">
        <img
          src={user.coverUrl}
          alt="Profile cover"
          className="object-cover w-full h-full"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors">
          <Pencil className="w-5 h-5 text-gray-600" />
        </button>        {/* Avatar */}
        <div className="absolute left-8 -bottom-28">
          <Avatar className="w-52 h-52 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-5xl bg-primary text-white">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="bg-white rounded-lg shadow mt-36 p-6 relative">
          {/* Action buttons */}
          <div className="absolute right-6 top-6 flex gap-2">
            <Button 
              variant="default" 
              className="bg-[#0a66c2] hover:bg-[#084d93] text-white font-medium px-3 py-1 h-auto"
            >
              Add profile section ▾
            </Button>
            <Button 
              variant="outline" 
              className="border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 font-medium px-3 py-1 h-auto"
            >
              More...
            </Button>
          </div>

          {/* Profile Info */}
          <div>
            <h1 className="text-[24px] font-semibold text-gray-900 leading-7">{user.name}</h1>
            <p className="text-[16px] text-gray-700 mt-1 leading-[1.5]">{user.headline}</p>
            {/* Professional Summary */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-gray-800">About</h2>
              <p className="text-gray-700 mt-1 text-[15px]">
                Experienced marketing consultant with a passion for brand strategy, growth hacking, and customer insights. Proven track record in demand generation and digital transformation for global clients.
              </p>
            </div>
            {/* ...existing location, connections, university ... */}
            <div className="flex items-center gap-2 mt-2 text-[14px] text-gray-500">
              <span>{user.location}</span>
              <span className="text-[#0a66c2]">
                <svg className="inline-block w-4 h-4 ml-1" viewBox="0 0 16 16">
                  <path fill="currentColor" d="M8 0a8 8 0 00-8 8 8 8 0 008 8 8 8 0 008-8 8 8 0 00-8-8zm.72 13l-.33-2.18h-.78L7.28 13H5.7l.86-6h3l.86 6H8.72zm-.44-7.46a1.28 1.28 0 01-.91.36 1.28 1.28 0 01-.91-.36 1.23 1.23 0 01-.37-.9c0-.35.12-.65.37-.9s.55-.37.9-.37.66.12.91.37.38.55.38.9c0 .35-.13.65-.38.9z"/>
                </svg>
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[14px] text-[#0a66c2] font-medium hover:underline cursor-pointer">
                {user.connections} connections
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-[14px] text-[#0a66c2] font-medium hover:underline cursor-pointer">
                Contact info
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <img
                  src="https://logo.clearbit.com/cuny.edu"
                  alt="CUNY"
                  className="w-6 h-6 rounded"
                />
                <span className="ml-2 text-[14px] text-gray-700">{user.university}</span>
              </div>
            </div>
          </div>
        </div>

        {/* New Profile Sections */}
        <div className="max-w-[1128px] mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Experience */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
            <ul className="space-y-3">
              <li>
                <div className="font-medium">Senior Marketing Consultant</div>
                <div className="text-sm text-gray-600">Acme Corp • Jan 2022 - Present</div>
                <div className="text-sm text-gray-700">Led a team of 8 in digital marketing transformation projects for Fortune 500 clients.</div>
              </li>
              <li>
                <div className="font-medium">Brand Strategist</div>
                <div className="text-sm text-gray-600">Brandify • Jun 2019 - Dec 2021</div>
                <div className="text-sm text-gray-700">Developed brand strategies and managed campaigns for tech startups.</div>
              </li>
            </ul>
          </div>
          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Education</h2>
            <ul className="space-y-3">
              <li>
                <div className="font-medium">City University of New York</div>
                <div className="text-sm text-gray-600">MBA, Marketing • 2016 - 2018</div>
              </li>
              <li>
                <div className="font-medium">National University of Singapore</div>
                <div className="text-sm text-gray-600">BBA, Business Administration • 2012 - 2016</div>
              </li>
            </ul>
          </div>
          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Brand Strategy</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Growth Hacking</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Digital Marketing</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Customer Insights</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Content Creation</span>
            </div>
          </div>
          {/* Certifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Certifications</h2>
            <ul className="space-y-2">
              <li>
                <div className="font-medium">Google Analytics Certified</div>
                <div className="text-sm text-gray-600">Google • 2023</div>
              </li>
              <li>
                <div className="font-medium">HubSpot Inbound Marketing</div>
                <div className="text-sm text-gray-600">HubSpot • 2022</div>
              </li>
            </ul>
          </div>
          {/* Resume Upload/Download */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Resume</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-[#0a66c2] border-[#0a66c2]">Upload Resume</Button>
              <Button variant="default" className="bg-[#0a66c2] text-white">Download Resume</Button>
            </div>
          </div>
          {/* Social Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Social Links</h2>
            <div className="flex flex-col gap-2">
              <a href="https://linkedin.com/in/example" target="_blank" rel="noopener" className="text-[#0a66c2] hover:underline">LinkedIn</a>
              <a href="https://github.com/example" target="_blank" rel="noopener" className="text-[#333] hover:underline">GitHub</a>
              <a href="https://portfolio.example.com" target="_blank" rel="noopener" className="text-[#333] hover:underline">Portfolio</a>
            </div>
          </div>
          {/* Languages */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Languages</h2>
            <ul className="flex flex-col gap-1">
              <li>English (Fluent)</li>
              <li>Mandarin (Professional)</li>
              <li>French (Conversational)</li>
            </ul>
          </div>
          {/* Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Projects</h2>
            <ul className="space-y-2">
              <li>
                <div className="font-medium">Global Brand Launch</div>
                <div className="text-sm text-gray-700">Managed the launch of a new product line in 10+ countries, resulting in 30% YoY growth.</div>
              </li>
              <li>
                <div className="font-medium">Customer Insights Dashboard</div>
                <div className="text-sm text-gray-700">Developed a dashboard for real-time customer analytics using React and D3.js.</div>
              </li>
            </ul>
          </div>
        </div>
        {/* ...existing Info Cards ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] text-gray-900 font-medium">
                  Show recruiters you're open to work 
                  <span className="text-gray-500 font-normal"> — you control who sees this</span>
                </p>
                <Button 
                  variant="outline"
                  className="mt-2 text-[14px] text-[#0a66c2] border-[#0a66c2] hover:bg-[#0a66c2]/10 h-auto py-1"
                >
                  Get started
                </Button>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 3.41L12.59 2 8 6.59 3.41 2 2 3.41 6.59 8 2 12.59 3.41 14 8 9.41 12.59 14 14 12.59 9.41 8z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] text-gray-900 font-medium">
                  Showcase services
                  <span className="text-gray-500 font-normal"> you offer so you and your business can be found in search</span>
                </p>
                <Button 
                  variant="outline"
                  className="mt-2 text-[14px] text-[#0a66c2] border-[#0a66c2] hover:bg-[#0a66c2]/10 h-auto py-1"
                >
                  Get started
                </Button>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 3.41L12.59 2 8 6.59 3.41 2 2 3.41 6.59 8 2 12.59 3.41 14 8 9.41 12.59 14 14 12.59 9.41 8z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
