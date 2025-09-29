// src/views/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-semibold mb-4">🌍 About Us</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed">
          We are a team dedicated to building smarter, data-driven solutions for sustainable metals management.
          Our mission is to make Life Cycle Assessment (LCA) and circularity insights accessible to industries,
          enabling them to reduce environmental impact while creating more resource-efficient systems.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Our Platform</h2>
        <p className="text-gray-700 leading-relaxed">
          Our platform is an AI-powered software tool that helps organizations understand the full journey of metals —
          from extraction and processing to product use and end-of-life. It not only measures the environmental footprint
          but also identifies opportunities for reuse, recycling, and circular economy pathways.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          By simplifying complex analysis, it empowers engineers, decision-makers, and sustainability professionals to make
          smarter choices without requiring deep expertise in LCA.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Why It Matters</h2>
        <p className="text-gray-700 leading-relaxed">
          Metals like aluminium, copper, and steel are essential for modern life — powering energy systems, infrastructure,
          and technology. However, traditional production models often lead to high carbon emissions, depletion of natural
          resources, and valuable materials ending up as waste.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          Our platform helps shift from a linear “take–make–dispose” model to a circular “reduce–reuse–recycle” model,
          where resources are kept in use longer, and waste is minimized.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">What We Offer</h2>
        <ul className="list-disc ml-5 text-gray-700 space-y-1">
          <li>✅ Multi-Metal Analysis – Assess multiple metals within the same project.</li>
          <li>✅ AI-Assisted Data Filling – Handles missing inputs with intelligent estimates.</li>
          <li>✅ Lifecycle Coverage – From raw material extraction to end-of-life scenarios.</li>
          <li>✅ Circularity Metrics – Recycled content, material efficiency, reuse potential.</li>
          <li>✅ Visual Dashboards – Clear graphs, flow diagrams, and comparison charts.</li>
          <li>✅ Actionable Insights – Practical recommendations to reduce impacts and improve circularity.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Who We Serve</h2>
        <p className="text-gray-700 leading-relaxed">
          Industries & Manufacturers, Engineers & Metallurgists, Sustainability Leaders & Decision-Makers,
          Researchers & Policy Makers — anyone looking to make metal use smarter and more sustainable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
        <p className="text-gray-700 leading-relaxed">
          We envision a world where metals are used smarter, longer, and cleaner. By combining AI, lifecycle data, and
          circular economy principles, our platform helps industries balance growth with sustainability — creating systems
          that are both environmentally responsible and economically resilient.
        </p>
        <p className="text-gray-700 mt-4">
          ✨ With this platform, we aim to make sustainability simple, actionable, and impactful for everyone working with metals.
        </p>
      </section>
    </div>
  );
}
