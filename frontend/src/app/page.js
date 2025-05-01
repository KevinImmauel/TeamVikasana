'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { motion } from "framer-motion";


export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (!loading && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background mt-10">
      {/* Hero section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Centralized Beat Management System
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Efficiently manage police beats, incidents, and emergency responses
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login" className="btn-primary text-lg px-8 py-3">
              Login to System
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Features section */}
      <motion.div
        id="features"
        className="bg-secondary py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div
              className="card flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Beat Assignment</h3>
              <p className="text-muted-foreground">Efficiently assign and manage beats to officers with customizable schedules and locations.</p>
            </motion.div>

            <motion.div
              className="card flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Incident Reporting</h3>
              <p className="text-muted-foreground">Document and track incidents with detailed information, location data, and officer assignments.</p>
            </motion.div>

            

            <motion.div
              className="card flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">SOS Emergency System</h3>
              <p className="text-muted-foreground">Quick emergency response system with real-time alerts and GPS tracking for officer safety.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="py-16 bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What Makes Us Unique</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Real-Time Monitoring</h3>
              <p className="text-muted-foreground">Track officers' locations and status in real-time, ensuring faster response times and better coordination.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-accent/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Integrated Communication</h3>
              <p className="text-muted-foreground">Incorporates secure messaging and alerts, enabling swift communication among officers and commanders.</p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-destructive/10 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Data-Driven Insights</h3>
              <p className="text-muted-foreground">Leverage data analytics for improving beat performance, incident tracking, and resource allocation.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>


      {/* Testimonials section */}
      <motion.div
        id="testimonials"
        className="py-16 bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What Our Users Say</h2>

          <div className="flex overflow-x-scroll gap-8">
            <motion.div
              className="flex-shrink-0 w-80 p-6 bg-white shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold text-muted-foreground mb-4">"This system has significantly improved our response times and team coordination. It's been a game-changer!"</p>
              <p className="text-right text-primary">- Officer John Doe</p>
            </motion.div>

            <motion.div
              className="flex-shrink-0 w-80 p-6 bg-white shadow-lg rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold text-muted-foreground mb-4">"A seamless solution for managing incidents and assignments. We highly recommend it to other departments."</p>
              <p className="text-right text-primary">- Sergeant Jane Smith</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      

      {/* Footer */}
      <motion.footer
        className="bg-background border-t border-border py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} Centralized Beat Management System | TeamVikasana
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
