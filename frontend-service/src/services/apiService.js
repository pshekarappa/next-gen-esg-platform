import axios from "axios";

// Base URLs for API calls, would be set from environment variables in production
const QUERY_SERVICE_URL = "http://localhost:8002";

// Create axios instances with default config
const queryServiceClient = axios.create({
  baseURL: QUERY_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For demo purposes - simulated data
const dummyPolicies = [
  {
    id: 1,
    title: "Carbon Emissions Reduction Policy",
    category: "Environmental",
    lastUpdated: "2023-04-12",
    summary:
      "This policy outlines our commitment to reducing carbon emissions across all operations by 30% by 2030 compared to our 2015 baseline.",
    keyPoints: [
      "Annual reduction targets of 3% year-over-year",
      "Implementation of renewable energy sources across all facilities",
      "Carbon offsetting for unavoidable emissions",
      "Regular audit and reporting of carbon footprint",
    ],
  },
  {
    id: 2,
    title: "Waste Management Policy",
    category: "Environmental",
    lastUpdated: "2023-02-18",
    summary:
      "Our waste management policy aims to minimize waste generation and maximize recycling across all operations, with a target of zero waste to landfill by 2025.",
    keyPoints: [
      "Reduce, reuse, recycle hierarchy in all operations",
      "Elimination of single-use plastics",
      "Composting of organic waste",
      "Supplier packaging requirements",
    ],
  },
  {
    id: 3,
    title: "Diversity and Inclusion Policy",
    category: "Social",
    lastUpdated: "2023-05-20",
    summary:
      "This policy outlines our commitment to creating a diverse and inclusive workplace where all employees feel valued and can contribute to their full potential.",
    keyPoints: [
      "Diverse recruitment practices",
      "Equal opportunity employment",
      "Zero tolerance for discrimination",
      "Inclusive leadership training",
    ],
  },
  {
    id: 4,
    title: "Board Governance Policy",
    category: "Governance",
    lastUpdated: "2022-11-30",
    summary:
      "Our governance policy ensures transparent and ethical decision-making at the highest levels of the organization, with clear accountability and stakeholder representation.",
    keyPoints: [
      "Independent board member requirements",
      "Regular board performance evaluations",
      "Stakeholder engagement processes",
      "Ethical decision-making framework",
    ],
  },
  {
    id: 5,
    title: "Sustainable Supply Chain Policy",
    category: "Environmental",
    lastUpdated: "2023-03-05",
    summary:
      "This policy establishes requirements for our suppliers to meet environmental, social, and governance standards that align with our sustainability goals.",
    keyPoints: [
      "Supplier code of conduct",
      "Regular supplier audits",
      "Preference for local suppliers",
      "Environmental impact assessment",
    ],
  },
];

// Mock response for ESG query
const mockQueryResponse = {
  answer:
    "Our carbon reduction targets for 2025 include a 15% reduction in Scope 1 and 2 emissions compared to our 2020 baseline. We are implementing renewable energy sources across all facilities, optimizing energy efficiency in operations, and transitioning our fleet to electric vehicles. We also have specific targets for each business unit and a quarterly review process to track progress.",
  confidence: 0.92,
  sourcePolicies: [
    { id: 1, title: "Carbon Emissions Reduction Policy" },
    { id: 5, title: "Sustainable Supply Chain Policy" },
  ],
};

/**
 * Search ESG policies with a natural language query
 * @param {string} query - The natural language query
 * @returns {Promise<Object>} - Query response with answer and sources
 */
export const searchESGQuery = async (query) => {
  try {
    // Call the actual Query Service
    const response = await queryServiceClient.post("/query", {
      query: query,
      n_results: 5,
      include_metadata: true,
    });

    // Transform the response to match the expected format in the UI
    const sourcePolicies = response.data.source_chunks.map((chunk, index) => ({
      id: index,
      title: chunk.metadata?.file_name || `Source ${index + 1}`,
    }));

    return {
      answer: response.data.answer,
      confidence: response.data.query_metadata?.confidence_score || 0.85,
      sourcePolicies: sourcePolicies,
    };
  } catch (error) {
    console.error("Error in searchESGQuery:", error);

    // Enhanced error handling for network issues
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const message = error.response.data?.detail || "Server error";
      console.error(`Server error ${status}: ${message}`);

      // Customize the error with status information
      const customError = new Error(`${message} (Status: ${status})`);
      customError.status = status;
      customError.response = error.response;
      throw customError;
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error: No response received");
      throw new Error("Network error: Unable to connect to the server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request error:", error.message);
      throw error;
    }

    // This fallback is now only reached if the network error doesn't throw
    // In a real app, we might want to use a mix of fake and real data
    // console.log("Falling back to mock data due to error");
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    // return mockQueryResponse;
  }
};

/**
 * Fetch all ESG policies
 * @returns {Promise<Array>} - List of policies
 */
export const getPolicies = async () => {
  try {
    // In a real implementation, this would call the backend API
    // const response = await apiClient.get('/policies');
    // return response.data;

    // For demo, return mock data after a short delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return dummyPolicies;
  } catch (error) {
    console.error("Error in getPolicies:", error);
    throw error;
  }
};

/**
 * Fetch a specific policy by ID
 * @param {number} id - Policy ID
 * @returns {Promise<Object>} - Policy details
 */
export const getPolicyById = async (id) => {
  try {
    // In a real implementation, this would call the backend API
    // const response = await apiClient.get(`/policies/${id}`);
    // return response.data;

    // For demo, find in mock data
    await new Promise((resolve) => setTimeout(resolve, 300));
    const policy = dummyPolicies.find((p) => p.id === id);
    if (!policy) throw new Error("Policy not found");
    return policy;
  } catch (error) {
    console.error("Error in getPolicyById:", error);
    throw error;
  }
};
