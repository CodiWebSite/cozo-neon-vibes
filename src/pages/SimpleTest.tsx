export default function SimpleTest() {
  // Date statice pentru testimoniale
  const testimonials = [
    {
      id: "1",
      name: "Maria Popescu",
      rating: 5,
      text: "DJ Cozo a fost fantastic la nunta noastră! Muzica a fost perfectă și toți invitații au dansat toată noaptea.",
      event: "Nuntă"
    },
    {
      id: "2", 
      name: "Alexandru Ionescu",
      rating: 5,
      text: "Profesionalism de top! Recomand cu încredere pentru orice eveniment.",
      event: "Petrecere corporativă"
    },
    {
      id: "3",
      name: "Elena Dumitrescu", 
      rating: 5,
      text: "Atmosfera creată a fost de neuitat. Mulțumim pentru o seară magică!",
      event: "Aniversare"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Simple Test - Testimonials</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <p className="text-green-400">✅ Successfully loaded {testimonials.length} testimonials</p>
        </div>

        <div className="grid gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg">
              <p className="text-lg mb-4">"{testimonial.text}"</p>
              <div className="text-purple-400">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm">{testimonial.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}