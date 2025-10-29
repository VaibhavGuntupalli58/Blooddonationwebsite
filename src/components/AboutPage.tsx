import { motion } from "motion/react";
import { Heart, Target, Award, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We believe in the power of human kindness and the impact of giving.",
    },
    {
      icon: Target,
      title: "Mission Driven",
      description: "Our mission is to ensure no patient suffers due to blood shortage.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in blood collection and storage.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "All donations are thoroughly tested to ensure recipient safety.",
    },
  ];

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
          <h1 className="text-5xl mb-6 text-gray-900">About BloodBank</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to saving lives by connecting voluntary blood donors with those in need.
            Every drop counts in our mission to ensure no patient suffers due to blood shortage.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="bg-white border-2 border-red-100 hover:shadow-xl transition-shadow duration-300">
            <CardContent className="py-12">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl mb-6 text-gray-900">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To create a sustainable blood donation ecosystem where voluntary donors can easily contribute to saving lives. 
                  We strive to maintain an adequate blood supply through community engagement, education, and a seamless 
                  donation process. Our platform ensures that every eligible donor can make a meaningful impact in their community.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-red-100">
                  <CardHeader>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <value.icon className="w-8 h-8 text-red-600" />
                    </div>
                    <CardTitle className="text-center">{value.title}</CardTitle>
                    <CardDescription className="text-center">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eligibility Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900">Donation Eligibility</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">You Can Donate If:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You are 18 years of age or older</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You weigh at least 60 kg (132 lbs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You are in good general health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You have not donated blood in the last 3 months</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">You Cannot Donate If:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>You are under 18 years of age</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>You weigh less than 60 kg (132 lbs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>You have a cold, flu, or fever</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✗</span>
                    <span>You are pregnant or breastfeeding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl text-center mb-12 text-gray-900">Donation Process</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Register", description: "Create an account and login to our platform" },
              { step: "2", title: "Fill Form", description: "Complete the donation form with your details" },
              { step: "3", title: "Verification", description: "Your eligibility is verified automatically" },
              { step: "4", title: "Donate", description: "Visit a blood bank near you to donate" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      {item.step}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
