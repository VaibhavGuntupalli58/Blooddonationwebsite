import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Users, Droplet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import axios from "axios";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface HomePageProps {
  isAuthenticated: boolean;
}

export function HomePage({ isAuthenticated }: HomePageProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalDonations: 0, allDonations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `https://${projectId}.supabase.co/functions/v1/make-server-78aacda0/stats`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Droplet className="w-24 h-24 text-red-600" fill="currentColor" />
          </motion.div>
          
          <h1 className="text-5xl mb-6 text-gray-900">
            Save Lives Through Blood Donation
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Every donation can save up to three lives. Join our community of heroes and make a difference today.
          </p>

          {!isAuthenticated ? (
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Blood Now
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/donate-form")}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2" />
              Fill Donation Form
            </Button>
          )}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <h2 className="text-3xl text-center mb-12 text-gray-900">Our Impact</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Droplet className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-4xl text-red-600">
                  {loading ? "..." : stats.totalDonations}
                </CardTitle>
                <CardDescription>Successful Donations</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-4xl text-red-600">
                  {loading ? "..." : stats.totalDonations}
                </CardTitle>
                <CardDescription>Registered Donors</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-red-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-4xl text-red-600">
                  {loading ? "..." : stats.totalDonations * 3}
                </CardTitle>
                <CardDescription>Lives Saved</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Donate Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12 text-gray-900">Why Donate Blood?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Save Lives",
                description: "One donation can save up to 3 lives",
              },
              {
                icon: TrendingUp,
                title: "Health Benefits",
                description: "Reduces risk of heart disease",
              },
              {
                icon: Users,
                title: "Community Impact",
                description: "Help those in your community",
              },
              {
                icon: Droplet,
                title: "Quick Process",
                description: "Takes only 10-15 minutes",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of donors who have already saved lives
            </p>
            {!isAuthenticated ? (
              <Button
                onClick={() => navigate("/login")}
                size="lg"
                variant="outline"
                className="bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Get Started Today
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/donate-form")}
                size="lg"
                variant="outline"
                className="bg-white text-red-600 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Donate Now
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
