import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Droplet, User, Calendar, Users, Activity, Weight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import axios from "axios";
import { projectId } from "../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface DonationFormProps {
  accessToken: string;
}

export function DonationForm({ accessToken }: DonationFormProps) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const [formData, setFormData] = useState({
    donorName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    weight: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donorName || !formData.age || !formData.gender || !formData.bloodGroup || !formData.weight) {
      toast.error("Please fill in all fields");
      return;
    }

    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);

    if (isNaN(age) || isNaN(weight)) {
      toast.error("Please enter valid numbers for age and weight");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `https://${projectId}.supabase.co/functions/v1/make-server-78aacda0/donate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsEligible(response.data.isEligible);
        setResultMessage(response.data.message);
        setShowResult(true);
        
        if (response.data.isEligible) {
          toast.success("Thank you for your donation!");
        } else {
          toast.warning("You are not currently eligible to donate");
        }
      }
    } catch (error: any) {
      console.error("Donation submission error:", error);
      toast.error(error.response?.data?.error || "Failed to submit donation form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleDonateAgain = () => {
    setShowResult(false);
    setFormData({
      donorName: "",
      age: "",
      gender: "",
      bloodGroup: "",
      weight: "",
    });
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className={`border-4 ${isEligible ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'} shadow-2xl`}>
            <CardContent className="py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-6"
              >
                {isEligible ? (
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Droplet className="w-12 h-12 text-white" fill="white" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <Droplet className="w-12 h-12 text-white" />
                  </div>
                )}
              </motion.div>

              <h2 className={`text-4xl mb-4 ${isEligible ? 'text-green-800' : 'text-red-800'}`}>
                {isEligible ? "Congratulations!" : "Not Eligible"}
              </h2>
              
              <p className={`text-xl mb-8 ${isEligible ? 'text-green-700' : 'text-red-700'}`}>
                {resultMessage}
              </p>

              {isEligible && (
                <div className="mb-8 p-6 bg-white rounded-lg border-2 border-green-200">
                  <h3 className="text-xl mb-4 text-gray-900">Next Steps</h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Visit your nearest blood donation center</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Bring a valid ID for verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>Eat a healthy meal and stay hydrated before donation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>The donation process takes about 10-15 minutes</span>
                    </li>
                  </ul>
                </div>
              )}

              {!isEligible && (
                <div className="mb-8 p-6 bg-white rounded-lg border-2 border-red-200">
                  <h3 className="text-xl mb-4 text-gray-900">Eligibility Requirements</h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Must be at least 18 years old</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Must weigh at least 60 kg (132 lbs)</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Please check back when you meet these requirements. Thank you for your interest in saving lives!
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="border-2 hover:shadow-lg transition-all duration-300"
                >
                  Go to Home
                </Button>
                {isEligible && (
                  <Button
                    onClick={handleDonateAgain}
                    className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
                  >
                    Fill Another Form
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Droplet className="w-16 h-16 text-red-600" fill="currentColor" />
          </motion.div>
          <h1 className="text-4xl mb-2 text-gray-900">Blood Donation Form</h1>
          <p className="text-gray-600">Please fill in your details to proceed with blood donation</p>
        </div>

        <Card className="border-2 border-red-100 shadow-xl">
          <CardHeader>
            <CardTitle>Donor Information</CardTitle>
            <CardDescription>All fields are required for eligibility verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Donor Name */}
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="pl-10"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Must be 18 years or older</p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight in kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="pl-10"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Must be at least 60 kg</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:shadow-lg"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Donation Form"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
