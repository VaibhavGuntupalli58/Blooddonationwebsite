import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Droplet, Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import axios from "axios";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Donor {
  donorName: string;
  bloodGroup: string;
  timestamp: string;
  age: number;
  gender: string;
}

export function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentDonors();
  }, []);

  const fetchRecentDonors = async () => {
    try {
      const response = await axios.get(
        `https://${projectId}.supabase.co/functions/v1/make-server-78aacda0/recent-donors`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      setDonors(response.data.donors);
    } catch (error) {
      console.error("Error fetching recent donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors: { [key: string]: string } = {
      "A+": "bg-red-100 text-red-700 border-red-300",
      "A-": "bg-red-200 text-red-800 border-red-400",
      "B+": "bg-blue-100 text-blue-700 border-blue-300",
      "B-": "bg-blue-200 text-blue-800 border-blue-400",
      "AB+": "bg-purple-100 text-purple-700 border-purple-300",
      "AB-": "bg-purple-200 text-purple-800 border-purple-400",
      "O+": "bg-green-100 text-green-700 border-green-300",
      "O-": "bg-green-200 text-green-800 border-green-400",
    };
    return colors[bloodGroup] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <Droplet className="w-16 h-16 text-red-600 mx-auto" fill="currentColor" />
          </div>
          <h1 className="text-5xl mb-6 text-gray-900">Our Heroes This Week</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These amazing individuals have donated blood this week and are making a real difference in saving lives.
          </p>
        </motion.div>

        {/* Donors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading recent donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent>
                <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl mb-4 text-gray-700">No Recent Donations</h3>
                <p className="text-gray-600">
                  Be the first hero this week! Register and donate blood to save lives.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {donors.map((donor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-red-100 hover:border-red-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700 transition-all duration-300"></div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{donor.donorName}</CardTitle>
                          <CardDescription className="text-sm">
                            {donor.gender}, {donor.age} years
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getBloodGroupColor(donor.bloodGroup)} border-2 px-3 py-1`}
                      >
                        {donor.bloodGroup}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Donated on {formatDate(donor.timestamp)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Thank You Section */}
        {donors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 max-w-4xl mx-auto">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl mb-4">Thank You, Heroes!</h2>
                <p className="text-xl opacity-90">
                  Your selfless contribution is saving lives and bringing hope to families in need.
                  Together, we're making our community stronger and healthier.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
