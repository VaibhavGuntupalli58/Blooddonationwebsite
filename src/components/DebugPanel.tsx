import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import axios from "axios";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function DebugPanel() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDatabaseTest = async () => {
    setTesting(true);
    setResults(null);

    try {
      // Fetch donors from database
      const response = await axios.get(
        `https://${projectId}.supabase.co/functions/v1/make-server-78aacda0/recent-donors`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const donors = response.data.donors;
      
      const testResults = {
        success: true,
        totalDonors: donors.length,
        donors: donors,
        sampleDonor: donors.length > 0 ? donors[0] : null,
        hasContactInfo: donors.some((d: any) => d.contactNumber && d.location),
        missingFields: donors.map((d: any) => ({
          name: d.donorName,
          hasPhone: !!d.contactNumber,
          hasLocation: !!d.location,
          phone: d.contactNumber || "MISSING",
          location: d.location || "MISSING"
        }))
      };

      setResults(testResults);
    } catch (error: any) {
      setResults({
        success: false,
        error: error.message || "Unknown error",
        details: error.response?.data
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-purple-50 mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          This panel helps diagnose why phone numbers and locations are not displaying.
          Click the button below to test the database connection and view raw data.
        </p>

        <Button 
          onClick={runDatabaseTest} 
          disabled={testing}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {testing ? "Testing..." : "Run Database Test"}
        </Button>

        {results && (
          <div className="mt-4 p-4 bg-white rounded-lg border space-y-3">
            {results.success ? (
              <>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <strong>Database Connected Successfully</strong>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Total Donors Found:</strong> {results.totalDonors}</p>
                  
                  {results.totalDonors > 0 ? (
                    <>
                      <div className={`p-3 rounded ${results.hasContactInfo ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {results.hasContactInfo ? (
                          <p className="text-green-800">✓ Some donors have phone & location data!</p>
                        ) : (
                          <p className="text-red-800">⚠ No donors have phone & location data in database!</p>
                        )}
                      </div>

                      <div className="mt-3">
                        <strong>Donor Details:</strong>
                        <div className="max-h-96 overflow-y-auto mt-2 space-y-2">
                          {results.missingFields.map((donor: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 rounded border text-xs">
                              <p><strong>Name:</strong> {donor.name}</p>
                              <p className={donor.hasPhone ? "text-green-700" : "text-red-700"}>
                                <strong>Phone:</strong> {donor.phone} {donor.hasPhone ? "✓" : "✗"}
                              </p>
                              <p className={donor.hasLocation ? "text-green-700" : "text-red-700"}>
                                <strong>Location:</strong> {donor.location} {donor.hasLocation ? "✓" : "✗"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <details className="mt-3">
                        <summary className="cursor-pointer text-purple-700 hover:text-purple-900">
                          View Raw JSON Data (Sample Donor)
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                          {JSON.stringify(results.sampleDonor, null, 2)}
                        </pre>
                      </details>
                    </>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800">
                        No donors found in database. Submit a new donation to test!
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <strong>Database Error</strong>
                </div>
                <p className="text-sm text-red-600">{results.error}</p>
                {results.details && (
                  <pre className="p-3 bg-red-50 rounded text-xs overflow-auto">
                    {JSON.stringify(results.details, null, 2)}
                  </pre>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
          <p className="text-blue-800">
            <strong>💡 Tip:</strong> If donors show "MISSING" for phone/location, they were added before 
            these fields were implemented. Submit a NEW donation with phone & location to test!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
