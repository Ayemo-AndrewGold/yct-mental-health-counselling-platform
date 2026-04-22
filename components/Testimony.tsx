import React from 'react';

const Testimony = () => {
  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <p className="uppercase text-sm tracking-widest text-green-800 mb-2">
          Student voices
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          What students are saying
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              initials: 'AO',
              name: 'Ayomide O.',
              dept: 'Computer Technology, ND2',
              quote:
                'I was scared to walk into the counselling office. This platform helped me talk to someone from my room.',
            },
            {
              initials: 'CU',
              name: 'Chidinma U.',
              dept: 'Business Administration, ND1',
              quote:
                'The self-assessment showed me I was more stressed than I realised. Booking was very easy.',
            },
            {
              initials: 'TE',
              name: 'Tobi E.',
              dept: 'Electrical Engineering, HND1',
              quote:
                'Anonymous mode was a lifesaver. I felt safe enough to ask for help.',
            },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <p className="text-lg text-gray-700 leading-relaxed italic mb-6">
                “{item.quote}”
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-semibold">
                  {item.initials}
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">{item.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimony;