package com.example.aiskillgapanalyzer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class JobSearchService {

    @Value("${adzuna.app.id}")
    private String appId;

    @Value("${adzuna.app.key}")
    private String appKey;

    @Value("${adzuna.country:in}")
    private String country;

    /*
     * Google Places API (New)
     *
     * application.properties:
     * google.places.api.key=YOUR_GOOGLE_PLACES_API_KEY
     */
    @Value("${google.places.api.key}")
    private String googlePlacesApiKey;

    private final RestTemplate restTemplate =
            new RestTemplate();

    /**
     * =========================================================
     * SEARCH REAL AND RELEVANT JOBS
     * =========================================================
     *
     * Example:
     *
     * Role     = Full Stack Developer
     * Location = Bangalore
     *
     * The service:
     *
     * 1. Creates related role searches
     * 2. Creates location variations
     * 3. Searches Adzuna
     * 4. Filters unrelated jobs
     * 5. Removes duplicate jobs
     * 6. Calculates relevance
     * 7. Sorts best jobs first
     */
    public List<Map<String, Object>> searchJobs(
            String role,
            String location) {

        // -----------------------------------------------------
        // VALIDATE ROLE
        // -----------------------------------------------------

        if (role == null
                || role.trim().isEmpty()) {

            return Collections.emptyList();
        }

        // -----------------------------------------------------
        // VALIDATE LOCATION
        // -----------------------------------------------------

        if (location == null
                || location.trim().isEmpty()) {

            return Collections.emptyList();
        }

        String cleanRole =
                role.trim();

        String cleanLocation =
                location.trim();

        System.out.println();
        System.out.println(
                "======================================"
        );

        System.out.println(
                "SMART ADZUNA JOB SEARCH"
        );

        System.out.println(
                "Role     : " + cleanRole
        );

        System.out.println(
                "Location : " + cleanLocation
        );

        System.out.println(
                "======================================"
        );

        try {

            // -------------------------------------------------
            // RELATED ROLE SEARCHES
            // -------------------------------------------------

            List<String> searchQueries =
                    buildSearchQueries(
                            cleanRole
                    );

            // -------------------------------------------------
            // LOCATION VARIATIONS
            // -------------------------------------------------

            List<String> locationQueries =
                    buildLocationQueries(
                            cleanLocation
                    );

            System.out.println();
            System.out.println(
                    "SEARCH QUERIES:"
            );

            for (String query : searchQueries) {

                System.out.println(
                        " -> " + query
                );
            }

            System.out.println();
            System.out.println(
                    "LOCATION QUERIES:"
            );

            for (String locationQuery :
                    locationQueries) {

                System.out.println(
                        " -> " + locationQuery
                );
            }

            // -------------------------------------------------
            // UNIQUE JOB STORAGE
            // -------------------------------------------------

            Map<String, Map<String, Object>>
                    uniqueJobs =
                    new LinkedHashMap<>();

            // -------------------------------------------------
            // SEARCH EACH ROLE + EACH LOCATION
            // -------------------------------------------------

            for (String query :
                    searchQueries) {

                for (String locationQuery :
                        locationQueries) {

                    System.out.println();
                    System.out.println(
                            "Searching:"
                    );

                    System.out.println(
                            "Role     : " + query
                    );

                    System.out.println(
                            "Location : "
                                    + locationQuery
                    );

                    // -----------------------------------------
                    // CALL ADZUNA
                    // -----------------------------------------

                    List<Map<String, Object>>
                            results =
                            searchAdzuna(
                                    query,
                                    locationQuery
                            );

                    System.out.println(
                            "Results  : "
                                    + results.size()
                    );

                    // -----------------------------------------
                    // PROCESS RESULTS
                    // -----------------------------------------

                    for (Map<String, Object> job :
                            results) {

                        String title =
                                getString(
                                        job.get(
                                                "title"
                                        )
                                );

                        String company =
                                getString(
                                        job.get(
                                                "company"
                                        )
                                );

                        if (title.isEmpty()) {
                            continue;
                        }

                        // -------------------------------------
                        // CALCULATE ROLE RELEVANCE
                        // -------------------------------------

                        int score =
                                calculateRelevanceScore(
                                        cleanRole,
                                        title
                                );

                        // -------------------------------------
                        // REMOVE UNRELATED JOBS
                        // -------------------------------------

                        if (score < 50) {
                            continue;
                        }

                        // -------------------------------------
                        // ADD MATCH INFORMATION
                        // -------------------------------------

                        job.put(
                                "relevanceScore",
                                score
                        );

                        job.put(
                                "matchLevel",
                                getMatchLevel(
                                        score
                                )
                        );

                        job.put(
                                "matchReason",
                                buildMatchReason(
                                        cleanRole,
                                        title
                                )
                        );

                        // -------------------------------------
                        // STORE SEARCH LOCATION
                        // -------------------------------------

                        job.put(
                                "searchedLocation",
                                cleanLocation
                        );

                        // -------------------------------------
                        // UNIQUE JOB KEY
                        // -------------------------------------

                        String uniqueKey =
                                buildUniqueKey(
                                        job,
                                        title,
                                        company
                                );

                        uniqueJobs.putIfAbsent(
                                uniqueKey,
                                job
                        );
                    }
                }
            }

            // -------------------------------------------------
            // CONVERT TO LIST
            // -------------------------------------------------

            List<Map<String, Object>>
                    jobs =
                    new ArrayList<>(
                            uniqueJobs.values()
                    );

            // -------------------------------------------------
            // SORT BY RELEVANCE
            // -------------------------------------------------

            jobs.sort(
                    (job1, job2) -> {

                        int score1 =
                                getInteger(
                                        job1.get(
                                                "relevanceScore"
                                        )
                                );

                        int score2 =
                                getInteger(
                                        job2.get(
                                                "relevanceScore"
                                        )
                                );

                        return Integer.compare(
                                score2,
                                score1
                        );
                    }
            );

            // -------------------------------------------------
            // MAXIMUM 20 JOBS
            // -------------------------------------------------

            if (jobs.size() > 20) {

                jobs =
                        new ArrayList<>(
                                jobs.subList(
                                        0,
                                        20
                                )
                        );
            }

            // -------------------------------------------------
            // PRINT RESULT INFORMATION
            // -------------------------------------------------

            System.out.println();
            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "FINAL JOB SEARCH RESULT"
            );

            System.out.println(
                    "Role     : " + cleanRole
            );

            System.out.println(
                    "Location : " + cleanLocation
            );

            System.out.println(
                    "Jobs     : " + jobs.size()
            );

            System.out.println(
                    "======================================"
            );

            // -------------------------------------------------
            // PRINT COMPANIES
            // -------------------------------------------------

            Set<String> companies =
                    new HashSet<>();

            for (Map<String, Object> job :
                    jobs) {

                String company =
                        getString(
                                job.get(
                                        "company"
                                )
                        );

                if (!company.isEmpty()) {

                    companies.add(
                            company
                    );
                }
            }

            System.out.println(
                    "Companies found: "
                            + companies.size()
            );

            for (String company :
                    companies) {

                System.out.println(
                        " -> " + company
                );
            }

            System.out.println(
                    "======================================"
            );

            return jobs;

        } catch (Exception e) {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "ADZUNA API ERROR"
            );

            System.out.println(
                    "Error Type: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Error Message: "
                            + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "======================================"
            );

            throw new RuntimeException(
                    "Adzuna API request failed: "
                            + e.getMessage()
            );
        }
    }

    /**
     * =========================================================
     * BUILD RELATED ROLE SEARCHES
     * =========================================================
     */
    private List<String> buildSearchQueries(
            String role) {

        List<String> queries =
                new ArrayList<>();

        String lowerRole =
                role.toLowerCase();

        // -----------------------------------------------------
        // FULL STACK
        // -----------------------------------------------------

        if (lowerRole.contains("full stack")
                || lowerRole.contains("fullstack")) {

            queries.add(
                    "Full Stack Developer"
            );

            queries.add(
                    "Full Stack Engineer"
            );

            queries.add(
                    "Fullstack Developer"
            );

            queries.add(
                    "Full Stack Software Engineer"
            );

            queries.add(
                    "Full Stack Web Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // JAVA
        // -----------------------------------------------------

        if (lowerRole.contains("java")) {

            queries.add(role);

            queries.add(
                    "Java Developer"
            );

            queries.add(
                    "Java Software Engineer"
            );

            queries.add(
                    "Java Engineer"
            );

            queries.add(
                    "Spring Boot Developer"
            );

            queries.add(
                    "Backend Java Developer"
            );

            queries.add(
                    "Java Full Stack Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // REACT
        // -----------------------------------------------------

        if (lowerRole.contains("react")) {

            queries.add(role);

            queries.add(
                    "React Developer"
            );

            queries.add(
                    "React JS Developer"
            );

            queries.add(
                    "Frontend React Developer"
            );

            queries.add(
                    "React Software Engineer"
            );

            queries.add(
                    "Frontend Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // PYTHON
        // -----------------------------------------------------

        if (lowerRole.contains("python")) {

            queries.add(role);

            queries.add(
                    "Python Developer"
            );

            queries.add(
                    "Python Software Engineer"
            );

            queries.add(
                    "Python Backend Developer"
            );

            queries.add(
                    "Django Developer"
            );

            queries.add(
                    "FastAPI Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // ANGULAR
        // -----------------------------------------------------

        if (lowerRole.contains("angular")) {

            queries.add(role);

            queries.add(
                    "Angular Developer"
            );

            queries.add(
                    "Angular Software Engineer"
            );

            queries.add(
                    "Frontend Angular Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // NODE.JS
        // -----------------------------------------------------

        if (lowerRole.contains("node")) {

            queries.add(role);

            queries.add(
                    "Node.js Developer"
            );

            queries.add(
                    "Node Developer"
            );

            queries.add(
                    "Node.js Backend Developer"
            );

            queries.add(
                    "Node.js Software Engineer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // DATA SCIENTIST
        // -----------------------------------------------------

        if (lowerRole.contains(
                "data scientist")) {

            queries.add(role);

            queries.add(
                    "Data Scientist"
            );

            queries.add(
                    "Machine Learning Engineer"
            );

            queries.add(
                    "AI Engineer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // MACHINE LEARNING
        // -----------------------------------------------------

        if (lowerRole.contains(
                "machine learning")
                || lowerRole.contains(
                "ml engineer")) {

            queries.add(role);

            queries.add(
                    "Machine Learning Engineer"
            );

            queries.add(
                    "ML Engineer"
            );

            queries.add(
                    "AI Engineer"
            );

            queries.add(
                    "Machine Learning Developer"
            );

            return removeDuplicates(
                    queries
            );
        }

        // -----------------------------------------------------
        // GENERIC DEVELOPER
        // -----------------------------------------------------

        queries.add(role);

        if (lowerRole.contains(
                "developer")) {

            String base =
                    lowerRole
                            .replace(
                                    "developer",
                                    ""
                            )
                            .trim();

            if (!base.isEmpty()) {

                queries.add(
                        base
                                + " Developer"
                );

                queries.add(
                        base
                                + " Engineer"
                );

                queries.add(
                        base
                                + " Software Engineer"
                );
            }
        }

        if (queries.isEmpty()) {

            queries.add(role);
        }

        return removeDuplicates(
                queries
        );
    }

    /**
     * =========================================================
     * BUILD LOCATION VARIATIONS
     * =========================================================
     *
     * This is important for Indian cities because job APIs
     * may use different names.
     *
     * Bangalore:
     *
     * Bangalore
     * Bengaluru
     * Bangalore, Karnataka
     * Bengaluru, Karnataka
     */
    private List<String> buildLocationQueries(
            String location) {

        List<String> locations =
                new ArrayList<>();

        String cleanLocation =
                location.trim();

        String lowerLocation =
                cleanLocation.toLowerCase();

        // Always search original location.
        locations.add(
                cleanLocation
        );

        // -----------------------------------------------------
        // BANGALORE / BENGALURU
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "bangalore")
                || lowerLocation.equals(
                "bengaluru")) {

            locations.add(
                    "Bangalore"
            );

            locations.add(
                    "Bengaluru"
            );

            locations.add(
                    "Bangalore, Karnataka"
            );

            locations.add(
                    "Bengaluru, Karnataka"
            );
        }

        // -----------------------------------------------------
        // HYDERABAD
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "hyderabad")) {

            locations.add(
                    "Hyderabad"
            );

            locations.add(
                    "Hyderabad, Telangana"
            );
        }

        // -----------------------------------------------------
        // CHENNAI
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "chennai")) {

            locations.add(
                    "Chennai"
            );

            locations.add(
                    "Chennai, Tamil Nadu"
            );
        }

        // -----------------------------------------------------
        // MUMBAI
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "mumbai")) {

            locations.add(
                    "Mumbai"
            );

            locations.add(
                    "Mumbai, Maharashtra"
            );
        }

        // -----------------------------------------------------
        // PUNE
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "pune")) {

            locations.add(
                    "Pune"
            );

            locations.add(
                    "Pune, Maharashtra"
            );
        }

        // -----------------------------------------------------
        // DELHI
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "delhi")
                || lowerLocation.equals(
                "new delhi")) {

            locations.add(
                    "Delhi"
            );

            locations.add(
                    "New Delhi"
            );

            locations.add(
                    "Delhi, India"
            );
        }

        // -----------------------------------------------------
        // NOIDA
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "noida")) {

            locations.add(
                    "Noida"
            );

            locations.add(
                    "Noida, Uttar Pradesh"
            );
        }

        // -----------------------------------------------------
        // GURGAON / GURUGRAM
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "gurgaon")
                || lowerLocation.equals(
                "gurugram")) {

            locations.add(
                    "Gurgaon"
            );

            locations.add(
                    "Gurugram"
            );

            locations.add(
                    "Gurgaon, Haryana"
            );

            locations.add(
                    "Gurugram, Haryana"
            );
        }

        // -----------------------------------------------------
        // KOLKATA
        // -----------------------------------------------------

        if (lowerLocation.equals(
                "kolkata")) {

            locations.add(
                    "Kolkata"
            );

            locations.add(
                    "Kolkata, West Bengal"
            );
        }

        return removeDuplicates(
                locations
        );
    }

    /**
     * =========================================================
     * SEARCH REAL COMPANIES USING GOOGLE PLACES API
     * =========================================================
     *
     * Selected role + selected location
     *              -> Google Places API
     *              -> Real companies/businesses
     *
     * Google Places is used for company discovery.
     * Adzuna remains available for current job information.
     */
    public List<Map<String, Object>> searchCompanies(
            String role,
            String location) {

        if (role == null || role.trim().isEmpty()) {
            return Collections.emptyList();
        }

        if (location == null || location.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String cleanRole = role.trim();
        String cleanLocation = location.trim();

        System.out.println();
        System.out.println("======================================");
        System.out.println("GOOGLE PLACES COMPANY SEARCH");
        System.out.println("Role     : " + cleanRole);
        System.out.println("Location : " + cleanLocation);
        System.out.println("======================================");

        try {
            /*
             * Discover real software/technology companies
             * in the selected location.
             */
            String textQuery =
                    "software companies in " + cleanLocation;

            String url =
                    "https://places.googleapis.com/v1/places:searchText";

            Map<String, Object> requestBody =
                    new HashMap<>();

            requestBody.put("textQuery", textQuery);
            requestBody.put("pageSize", 20);

            HttpHeaders headers =
                    new HttpHeaders();

            headers.set(
                    "X-Goog-Api-Key",
                    googlePlacesApiKey
            );

            /*
             * Request only fields required by our application.
             */
            headers.set(
                    "X-Goog-FieldMask",
                    "places.id,"
                            + "places.displayName,"
                            + "places.formattedAddress,"
                            + "places.types,"
                            + "places.websiteUri,"
                            + "places.googleMapsUri,"
                            + "places.rating,"
                            + "places.userRatingCount,"
                            + "places.businessStatus"
            );

            headers.set(
                    "Content-Type",
                    "application/json"
            );

            HttpEntity<Map<String, Object>> requestEntity =
                    new HttpEntity<>(
                            requestBody,
                            headers
                    );

            Map<String, Object> response =
                    restTemplate.postForObject(
                            url,
                            requestEntity,
                            Map.class
                    );

            if (response == null) {
                return Collections.emptyList();
            }

            Object placesObject =
                    response.get("places");

            if (!(placesObject instanceof List<?>)) {
                return Collections.emptyList();
            }

            List<?> places =
                    (List<?>) placesObject;

            List<Map<String, Object>> companies =
                    new ArrayList<>();

            for (Object item : places) {

                if (!(item instanceof Map<?, ?>)) {
                    continue;
                }

                Map<?, ?> place =
                        (Map<?, ?>) item;

                String companyName =
                        getGoogleDisplayName(place);

                if (companyName.isEmpty()) {
                    continue;
                }

                Map<String, Object> company =
                        new LinkedHashMap<>();

                company.put(
                        "placeId",
                        place.get("id")
                );

                company.put(
                        "company",
                        companyName
                );

                company.put(
                        "location",
                        place.get("formattedAddress")
                );

                company.put(
                        "website",
                        place.get("websiteUri")
                );

                company.put(
                        "googleMapsUrl",
                        place.get("googleMapsUri")
                );

                company.put(
                        "rating",
                        place.get("rating")
                );

                company.put(
                        "userRatingCount",
                        place.get("userRatingCount")
                );

                company.put(
                        "businessStatus",
                        place.get("businessStatus")
                );

                company.put(
                        "types",
                        place.get("types")
                );

                company.put(
                        "targetRole",
                        cleanRole
                );

                company.put(
                        "targetLocation",
                        cleanLocation
                );

                company.put(
                        "source",
                        "Google Places"
                );

                companies.add(company);
            }

            System.out.println(
                    "Google companies found: "
                            + companies.size()
            );

            for (Map<String, Object> company :
                    companies) {

                System.out.println(
                        " -> " + company.get("company")
                );
            }

            System.out.println(
                    "======================================"
            );

            return companies;

        } catch (Exception e) {

            System.out.println(
                    "GOOGLE PLACES API ERROR"
            );

            System.out.println(
                    "Error Type: "
                            + e.getClass().getName()
            );

            System.out.println(
                    "Error Message: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Google Places API request failed: "
                            + e.getMessage()
            );
        }
    }

    /**
     * Extract the company name from Google's displayName object.
     */
    private String getGoogleDisplayName(
            Map<?, ?> place) {

        Object displayNameObject =
                place.get("displayName");

        if (!(displayNameObject instanceof Map<?, ?>)) {
            return "";
        }

        Map<?, ?> displayName =
                (Map<?, ?>) displayNameObject;

        Object text =
                displayName.get("text");

        if (text == null) {
            return "";
        }

        return text.toString().trim();
    }

    /**
     * =========================================================
     * CALL ADZUNA API
     * =========================================================
     */
    private List<Map<String, Object>> searchAdzuna(
            String query,
            String location) {

        try {

            String baseUrl =
                    "https://api.adzuna.com/v1/api/jobs/"
                            + country
                            + "/search/1";

            String url =
                    UriComponentsBuilder
                            .fromUriString(
                                    baseUrl
                            )
                            .queryParam(
                                    "app_id",
                                    appId
                            )
                            .queryParam(
                                    "app_key",
                                    appKey
                            )
                            .queryParam(
                                    "what",
                                    query
                            )
                            .queryParam(
                                    "where",
                                    location
                            )
                            .queryParam(
                                    "results_per_page",
                                    20
                            )
                            .queryParam(
                                    "content-type",
                                    "application/json"
                            )
                            .toUriString();

            Map<String, Object> response =
                    restTemplate.getForObject(
                            url,
                            Map.class
                    );

            if (response == null) {

                return Collections.emptyList();
            }

            Object resultsObject =
                    response.get(
                            "results"
                    );

            if (!(resultsObject
                    instanceof List<?>)) {

                return Collections.emptyList();
            }

            List<?> rawResults =
                    (List<?>) resultsObject;

            List<Map<String, Object>> jobs =
                    new ArrayList<>();

            for (Object item :
                    rawResults) {

                if (!(item
                        instanceof Map<?, ?>)) {

                    continue;
                }

                Map<?, ?> job =
                        (Map<?, ?>) item;

                Map<String, Object> jobData =
                        new HashMap<>();

                // -------------------------------------------------
                // JOB ID
                // -------------------------------------------------

                jobData.put(
                        "id",
                        job.get("id")
                );

                // -------------------------------------------------
                // TITLE
                // -------------------------------------------------

                jobData.put(
                        "title",
                        job.get("title")
                );

                // -------------------------------------------------
                // DESCRIPTION
                // -------------------------------------------------

                jobData.put(
                        "description",
                        job.get("description")
                );

                // -------------------------------------------------
                // APPLY URL
                // -------------------------------------------------

                jobData.put(
                        "redirectUrl",
                        job.get(
                                "redirect_url"
                        )
                );

                // -------------------------------------------------
                // CREATED DATE
                // -------------------------------------------------

                jobData.put(
                        "created",
                        job.get(
                                "created"
                        )
                );

                // -------------------------------------------------
                // SALARY
                // -------------------------------------------------

                jobData.put(
                        "salaryMin",
                        job.get(
                                "salary_min"
                        )
                );

                jobData.put(
                        "salaryMax",
                        job.get(
                                "salary_max"
                        )
                );

                jobData.put(
                        "salaryPredicted",
                        job.get(
                                "salary_is_predicted"
                        )
                );

                // -------------------------------------------------
                // CONTRACT
                // -------------------------------------------------

                jobData.put(
                        "contractType",
                        job.get(
                                "contract_type"
                        )
                );

                jobData.put(
                        "contractTime",
                        job.get(
                                "contract_time"
                        )
                );

                // -------------------------------------------------
                // CATEGORY
                // -------------------------------------------------

                jobData.put(
                        "category",
                        getNestedValue(
                                job,
                                "category",
                                "label"
                        )
                );

                // -------------------------------------------------
                // COMPANY
                // -------------------------------------------------

                jobData.put(
                        "company",
                        getNestedValue(
                                job,
                                "company",
                                "display_name"
                        )
                );

                // -------------------------------------------------
                // LOCATION
                // -------------------------------------------------

                jobData.put(
                        "location",
                        getNestedValue(
                                job,
                                "location",
                                "display_name"
                        )
                );

                // -------------------------------------------------
                // SOURCE
                // -------------------------------------------------

                jobData.put(
                        "source",
                        "Adzuna"
                );

                jobs.add(
                        jobData
                );
            }

            return jobs;

        } catch (Exception e) {

            System.out.println(
                    "Adzuna search failed."
            );

            System.out.println(
                    "Query: "
                            + query
            );

            System.out.println(
                    "Location: "
                            + location
            );

            System.out.println(
                    "Error: "
                            + e.getMessage()
            );

            /*
             * One failed search should not stop all
             * other role/location searches.
             */
            return Collections.emptyList();
        }
    }

    /**
     * =========================================================
     * CALCULATE ROLE RELEVANCE
     * =========================================================
     */
    private int calculateRelevanceScore(
            String role,
            String jobTitle) {

        String normalizedRole =
                normalize(role);

        String normalizedTitle =
                normalize(jobTitle);

        int score = 0;

        // -----------------------------------------------------
        // EXACT ROLE MATCH
        // -----------------------------------------------------

        if (normalizedTitle.contains(
                normalizedRole)) {

            return 100;
        }

        // -----------------------------------------------------
        // FULL STACK
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "full stack")) {

            if (normalizedTitle.contains(
                    "full stack")) {

                score += 80;
            }

            if (normalizedTitle.contains(
                    "fullstack")) {

                score += 80;
            }

            if (normalizedTitle.contains(
                    "software engineer")) {

                score += 10;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 10;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // JAVA
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "java")) {

            if (normalizedTitle.contains(
                    "java")) {

                score += 70;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 15;
            }

            if (normalizedTitle.contains(
                    "engineer")) {

                score += 15;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // REACT
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "react")) {

            if (normalizedTitle.contains(
                    "react")) {

                score += 75;
            }

            if (normalizedTitle.contains(
                    "frontend")) {

                score += 15;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 10;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // PYTHON
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "python")) {

            if (normalizedTitle.contains(
                    "python")) {

                score += 70;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 15;
            }

            if (normalizedTitle.contains(
                    "engineer")) {

                score += 15;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // ANGULAR
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "angular")) {

            if (normalizedTitle.contains(
                    "angular")) {

                score += 75;
            }

            if (normalizedTitle.contains(
                    "frontend")) {

                score += 15;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 10;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // NODE
        // -----------------------------------------------------

        if (normalizedRole.contains(
                "node")) {

            if (normalizedTitle.contains(
                    "node")) {

                score += 75;
            }

            if (normalizedTitle.contains(
                    "backend")) {

                score += 15;
            }

            if (normalizedTitle.contains(
                    "developer")) {

                score += 10;
            }

            return Math.min(
                    score,
                    100
            );
        }

        // -----------------------------------------------------
        // GENERIC ROLE MATCH
        // -----------------------------------------------------

        String[] roleWords =
                normalizedRole.split(
                        "\\s+"
                );

        int matchedWords = 0;

        int importantWords = 0;

        for (String word :
                roleWords) {

            if (word.length() < 3) {
                continue;
            }

            if (isGenericWord(word)) {
                continue;
            }

            importantWords++;

            if (normalizedTitle.contains(
                    word)) {

                matchedWords++;
            }
        }

        if (importantWords > 0) {

            double percentage =
                    (double) matchedWords
                            / importantWords;

            score =
                    (int)
                            (percentage * 80);
        }

        if (normalizedTitle.contains(
                "developer")) {

            score += 10;
        }

        if (normalizedTitle.contains(
                "engineer")) {

            score += 10;
        }

        return Math.min(
                score,
                100
        );
    }

    /**
     * =========================================================
     * MATCH LEVEL
     * =========================================================
     */
    private String getMatchLevel(
            int score) {

        if (score >= 90) {

            return "Excellent Match";
        }

        if (score >= 75) {

            return "High Match";
        }

        if (score >= 60) {

            return "Good Match";
        }

        return "Related";
    }

    /**
     * =========================================================
     * MATCH REASON
     * =========================================================
     */
    private String buildMatchReason(
            String role,
            String title) {

        int score =
                calculateRelevanceScore(
                        role,
                        title
                );

        if (score >= 90) {

            return
                    "Job title directly matches your target career role.";
        }

        if (score >= 75) {

            return
                    "Job title is strongly related to your target career role.";
        }

        return
                "Job title contains keywords related to your target career role.";
    }

    /**
     * =========================================================
     * UNIQUE JOB KEY
     * =========================================================
     */
    private String buildUniqueKey(
            Map<String, Object> job,
            String title,
            String company) {

        Object id =
                job.get("id");

        if (id != null
                && !id.toString()
                .trim()
                .isEmpty()) {

            return "ID_"
                    + id.toString();
        }

        return (
                title
                        + "_"
                        + company
        ).toLowerCase();
    }

    /**
     * =========================================================
     * REMOVE DUPLICATES
     * =========================================================
     */
    private List<String> removeDuplicates(
            List<String> values) {

        Set<String> unique =
                new HashSet<>();

        List<String> result =
                new ArrayList<>();

        for (String value :
                values) {

            if (value == null) {
                continue;
            }

            String clean =
                    value.trim();

            if (clean.isEmpty()) {
                continue;
            }

            String key =
                    clean.toLowerCase();

            if (unique.add(key)) {

                result.add(
                        clean
                );
            }
        }

        return result;
    }

    /**
     * =========================================================
     * NORMALIZE TEXT
     * =========================================================
     */
    private String normalize(
            String text) {

        if (text == null) {

            return "";
        }

        return text
                .toLowerCase()
                .replaceAll(
                        "[^a-z0-9]+",
                        " "
                )
                .trim();
    }

    /**
     * =========================================================
     * GENERIC ROLE WORDS
     * =========================================================
     */
    private boolean isGenericWord(
            String word) {

        return word.equals("developer")
                || word.equals("engineer")
                || word.equals("software")
                || word.equals("senior")
                || word.equals("junior")
                || word.equals("associate")
                || word.equals("lead")
                || word.equals("the")
                || word.equals("and");
    }

    /**
     * =========================================================
     * GET STRING SAFELY
     * =========================================================
     */
    private String getString(
            Object value) {

        if (value == null) {

            return "";
        }

        return value
                .toString()
                .trim();
    }

    /**
     * =========================================================
     * GET INTEGER SAFELY
     * =========================================================
     */
    private int getInteger(
            Object value) {

        if (value == null) {

            return 0;
        }

        try {

            return Integer.parseInt(
                    value.toString()
            );

        } catch (Exception e) {

            return 0;
        }
    }

    /**
     * =========================================================
     * GET NESTED VALUE
     * =========================================================
     *
     * Example:
     *
     * company -> display_name
     * location -> display_name
     */
    private Object getNestedValue(
            Map<?, ?> data,
            String parent,
            String child) {

        Object parentObject =
                data.get(parent);

        if (parentObject
                instanceof Map<?, ?>) {

            Map<?, ?> parentMap =
                    (Map<?, ?>) parentObject;

            return parentMap.get(
                    child
            );
        }

        return null;
    }
}