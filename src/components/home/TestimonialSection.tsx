import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Engineering Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'The interactive simulations helped me understand fluid mechanics concepts better than traditional textbooks.'
  },
  {
    name: 'Michael Chen',
    role: 'Professor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'An excellent teaching tool that brings fluid mechanics principles to life for my students.'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Research Assistant',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'The real-time visualizations make complex concepts easy to grasp. Highly recommended!'
  }
];

export function TestimonialSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Discover how our virtual lab is helping students and educators worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4">
                  <div className="bg-blue-500 rounded-full p-2">
                    <Quote className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-blue-200">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-blue-100">{testimonial.content}</p>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}