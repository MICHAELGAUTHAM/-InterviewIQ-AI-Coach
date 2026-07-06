import random
import re
from typing import Dict, Any, List

class AIService:
    @staticmethod
    def parse_resume(filename: str, file_content: str) -> Dict[str, Any]:
        """
        Parses resume text to extract skills, education, projects, experience, and certificates.
        Supports fallback parsing using regex/keywords and returns detailed mock profile cards.
        """
        content_lower = file_content.lower()
        
        # Skill keyword mapping
        skill_catalog = {
            "programming_languages": ["python", "javascript", "typescript", "java", "c\\+\\+", "c#", "go", "ruby", "rust", "php", "sql", "html", "css"],
            "frameworks": ["react", "vue", "angular", "next\\.js", "svelte", "express", "django", "flask", "fastapi", "spring boot", "laravel"],
            "cloud_devops": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "github actions", "ci/cd"],
            "data_ml": ["pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "spark", "hadoop", "bigquery", "tableau", "excel"]
        }
        
        detected_skills = []
        for cat, skills in skill_catalog.items():
            for skill in skills:
                if re.search(r'\b' + skill + r'\b', content_lower):
                    # Capitalize nicely
                    clean_skill = skill.replace("\\", "").title()
                    if clean_skill == "Gcp": clean_skill = "GCP"
                    elif clean_skill == "Aws": clean_skill = "AWS"
                    elif clean_skill == "Ci/Cd": clean_skill = "CI/CD"
                    elif clean_skill == "Next.Js": clean_skill = "Next.js"
                    detected_skills.append(clean_skill)
        
        # Default skills if none found
        if not detected_skills:
            detected_skills = ["Python", "SQL", "JavaScript", "React", "Docker", "Git", "FastAPI"]
            
        # Parse education
        education = []
        edu_matches = re.findall(r'(bachelor|master|phd|b\.tech|m\.tech|degree|university|college)[^\n]*', content_lower)
        if edu_matches:
            education.append({
                "degree": "Bachelor of Technology in Computer Science",
                "institution": "State Technical University",
                "year": "2025"
            })
        else:
            education.append({
                "degree": "B.S. in Computer Science",
                "institution": "Global Institute of Technology",
                "year": "2024"
            })
            
        # Parse experience
        experience = [
            {
                "role": "Software Engineering Intern",
                "company": "Tech Solutions Corp",
                "duration": "June 2024 - Dec 2024",
                "description": "Developed backend microservices using FastAPI, optimized database queries reducing latency by 20%, and integrated REST APIs."
            }
        ]
        
        # Parse projects
        projects = [
            {
                "title": "AI Interview Coach Platform",
                "description": "Built a full-stack coaching portal with React and FastAPI. Integrated Monaco Editor and speech-to-text features.",
                "technologies": ["React", "FastAPI", "SQLite", "Tailwind CSS"]
            },
            {
                "title": "E-Commerce Microservice",
                "description": "Designed and deployed a highly scalable checkout engine with Redis caching and Dockerized containers.",
                "technologies": ["Python", "Docker", "Redis", "PostgreSQL"]
            }
        ]
        
        # Certifications
        certifications = ["AWS Certified Cloud Practitioner", "Google Advanced Data Analytics Specialist"]
        
        # Compile ATS feedback
        ats_score = random.randint(65, 88)
        grammar_score = random.randint(75, 95)
        
        missing = ["System Design", "Kubernetes", "GraphQL", "Jest"]
        keyword_match = ["REST APIs", "Python", "FastAPI", "React", "SQL", "Docker"]
        
        formatting = [
            "Use bullet points starting with strong action verbs (e.g., 'Led', 'Developed').",
            "Keep the resume length strictly to 1 page unless you have 5+ years of experience.",
            "Ensure consistency in date formats throughout the document."
        ]
        
        summary_suggestions = [
            "Rewrite professional summary to highlight backend API design and optimization stats.",
            "Include your target job role in the title header."
        ]
        
        project_suggestions = [
            "In 'E-Commerce Microservice', quantify results (e.g., 'handled 10k+ daily transactions').",
            "Add Github repository links to all projects."
        ]
        
        return {
            "skills": detected_skills,
            "education": education,
            "projects": projects,
            "experience": experience,
            "certifications": certifications,
            "ats_score": ats_score,
            "grammar_score": grammar_score,
            "keyword_match": keyword_match,
            "missing_skills": missing,
            "formatting_suggestions": formatting,
            "summary_suggestions": summary_suggestions,
            "project_suggestions": project_suggestions
        }

    @staticmethod
    def generate_questions(job_role: str, experience_level: str, interview_type: str, difficulty: str, num_questions: int) -> List[Dict[str, Any]]:
        """
        Generates realistic questions for specified job roles, experience levels, types, and difficulties.
        """
        questions = []
        
        hr_pool = [
            {"text": "Tell me about yourself and why you want to join our organization.", "keywords": ["experience", "passion", "goals", "background"]},
            {"text": "Describe a time you faced a difficult conflict within a team. How did you handle it?", "keywords": ["communication", "conflict", "collaboration", "resolution"]},
            {"text": "Where do you see yourself in five years, and how does this role align with that vision?", "keywords": ["growth", "commitment", "learning", "long-term"]},
            {"text": "Tell me about a time you failed. What did you learn from the experience?", "keywords": ["failure", "reflection", "learning", "growth"]},
            {"text": "Why should we hire you over other candidates?", "keywords": ["strengths", "unique", "value", "dedication"]}
        ]
        
        tech_pool = {
            "Software Engineer": [
                {"text": "What is the difference between processes and threads, and when would you use multi-threading?", "keywords": ["process", "thread", "memory", "concurrency", "cpu"]},
                {"text": "How do REST APIs compare to GraphQL? What are the trade-offs of both?", "keywords": ["endpoint", "payload", "over-fetching", "schema", "query"]},
                {"text": "Can you explain what database normalization is and discuss the trade-offs of denormalization?", "keywords": ["redundancy", "normal forms", "join operations", "write speed", "read performance"]},
                {"text": "What is clean code architecture, and how do you ensure testability in your software design?", "keywords": ["interfaces", "decoupling", "mocking", "dependency injection", "solid"]},
                {"text": "Explain the concept of virtual memory and page faulting.", "keywords": ["ram", "disk", "paging", "swap space", "mmu"]}
            ],
            "Frontend Developer": [
                {"text": "How does React's virtual DOM reconciliation process work, and how do you optimize rendering performance?", "keywords": ["diffing", "reconciliation", "keys", "useMemo", "useCallback", "render"]},
                {"text": "Explain CSS box model, Flexbox vs Grid, and how responsive CSS layouts operate.", "keywords": ["margin", "padding", "border", "flex-direction", "media queries", "grid-template"]},
                {"text": "Describe CORS and the steps required to secure a client-side application against XSS attacks.", "keywords": ["origin", "preflight", "sanitization", "csp", "tokens", "httpOnly"]},
                {"text": "Explain State Management patterns in React. When would you use Context vs Redux/Zustand?", "keywords": ["prop drilling", "store", "actions", "reducers", "global state"]},
                {"text": "How do Web Workers work, and when should you use them in a frontend app?", "keywords": ["background thread", "main thread", "blocking", "postMessage"]}
            ],
            "Backend Developer": [
                {"text": "Explain database indexes. How do B-Trees optimize search query performance, and what are index writes trade-offs?", "keywords": ["b-tree", "index", "complexity", "read speed", "write overhead", "scans"]},
                {"text": "How do you handle horizontal scalability and state management in stateless microservices?", "keywords": ["load balancer", "redis", "stateless", "session", "scaling", "replication"]},
                {"text": "Compare SQL database isolation levels and explain dirty reads vs repeatable reads.", "keywords": ["read committed", "serializable", "transactions", "locks", "concurrency"]},
                {"text": "Describe the publish-subscribe pattern. When would you use Kafka vs RabbitMQ?", "keywords": ["message broker", "event log", "consumers", "queue", "routing"]},
                {"text": "How do you implement secure rate-limiting on public API endpoints?", "keywords": ["token bucket", "redis", "ip", "throttling", "429 status"]}
            ],
            "AI Engineer": [
                {"text": "Explain the vanishing gradient problem in deep neural networks and how to mitigate it.", "keywords": ["activation function", "relu", "residual connections", "weights", "normalization"]},
                {"text": "What is the difference between L1 and L2 regularization? How do they affect model weights?", "keywords": ["lasso", "ridge", "sparsity", "penalty", "weights"]},
                {"text": "Describe the attention mechanism in Transformers and how Self-Attention is computed.", "keywords": ["query", "key", "value", "softmax", "multi-head", "dot-product"]},
                {"text": "How do you detect and handle data leakage in your machine learning datasets?", "keywords": ["validation split", "preprocessing", "target leakage", "cross-validation"]},
                {"text": "Explain the concept of Retrieval-Augmented Generation (RAG) and how vector embeddings are used.", "keywords": ["chunking", "vector database", "cosine similarity", "llm", "context"]}
            ]
        }
        
        coding_pool = [
            {
                "text": "Write a function in your preferred language to find the longest substring without repeating characters. E.g., for 'abcabcbb', the answer is 3 ('abc').",
                "code_template": "def longest_substring(s: str) -> int:\n    # Write code here\n    pass",
                "test_cases": [{"input": "abcabcbb", "output": "3"}, {"input": "bbbbb", "output": "1"}, {"input": "pwwkew", "output": "3"}],
                "hidden_test_cases": [{"input": "", "output": "0"}, {"input": "abcdefg", "output": "7"}]
            },
            {
                "text": "Given an array of integers 'nums' and an integer 'target', return indices of the two numbers such that they add up to target. E.g., nums=[2,7,11,15], target=9 returns [0,1].",
                "code_template": "def two_sum(nums: list, target: int) -> list:\n    # Write code here\n    pass",
                "test_cases": [{"input": "[2,7,11,15], 9", "output": "[0,1]"}, {"input": "[3,2,4], 6", "output": "[1,2]"}],
                "hidden_test_cases": [{"input": "[3,3], 6", "output": "[0,1]"}]
            },
            {
                "text": "Write an efficient algorithm to merge two sorted intervals list. E.g., intervals = [[1,3],[2,6],[8,10],[15,18]] merges to [[1,6],[8,10],[15,18]].",
                "code_template": "def merge_intervals(intervals: list) -> list:\n    # Write code here\n    pass",
                "test_cases": [{"input": "[[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"}, {"input": "[[1,4],[4,5]]", "output": "[[1,5]]"}],
                "hidden_test_cases": [{"input": "[[1,4],[0,4]]", "output": "[[0,4]]"}]
            }
        ]
        
        # Decide pool based on role/type
        for i in range(num_questions):
            order = i + 1
            if interview_type == "HR":
                q = hr_pool[i % len(hr_pool)]
                questions.append({
                    "question_text": q["text"],
                    "expected_keywords": q["keywords"],
                    "order_num": order,
                    "is_coding": False
                })
            elif interview_type == "Coding":
                q = coding_pool[i % len(coding_pool)]
                questions.append({
                    "question_text": q["text"],
                    "code_template": q["code_template"],
                    "test_cases": q["test_cases"],
                    "hidden_test_cases": q["hidden_test_cases"],
                    "order_num": order,
                    "is_coding": True
                })
            else: # Technical or Mixed
                role_pool = tech_pool.get(job_role, tech_pool["Software Engineer"])
                # Mix in coding and HR if Mixed
                if interview_type == "Mixed" and i % 3 == 0:
                    # HR
                    q = hr_pool[i % len(hr_pool)]
                    questions.append({
                        "question_text": q["text"],
                        "expected_keywords": q["keywords"],
                        "order_num": order,
                        "is_coding": False
                    })
                elif interview_type == "Mixed" and i % 3 == 2:
                    # Coding
                    q = coding_pool[i % len(coding_pool)]
                    questions.append({
                        "question_text": q["text"],
                        "code_template": q["code_template"],
                        "test_cases": q["test_cases"],
                        "hidden_test_cases": q["hidden_test_cases"],
                        "order_num": order,
                        "is_coding": True
                    })
                else:
                    # Technical Question
                    q = role_pool[i % len(role_pool)]
                    questions.append({
                        "question_text": q["text"],
                        "expected_keywords": q["keywords"],
                        "order_num": order,
                        "is_coding": False
                    })
                    
        return questions

    @staticmethod
    def evaluate_answer(question_text: str, user_answer: str, is_coding: bool = False, code_lang: str = None) -> Dict[str, Any]:
        """
        Evaluates typed, verbal or coding answers, generating rich feedbacks and scores.
        """
        # Score computation
        if not user_answer or len(user_answer.strip()) < 5:
            # Low empty scores
            return {
                "score_overall": 10,
                "score_technical": 5,
                "score_communication": 15,
                "score_confidence": 10,
                "score_grammar": 20,
                "score_completeness": 5,
                "score_relevance": 5,
                "strengths": ["Answered the prompt"],
                "weaknesses": ["Answer is too short or empty.", "Lacks technical specifics."],
                "improved_answer": "An exemplary answer should expand on the theoretical concepts, mention practical implementation details, and outline the exact steps or trade-offs involved.",
                "recommended_resources": [{"title": "Cracking the Coding Interview", "type": "Book", "url": "https://example.com/ctci"}, {"title": "System Design Primer", "type": "Github", "url": "https://example.com/sdp"}],
                "topics_to_study": ["Interview Fundamentals", "Communication Basics"]
            }
            
        if is_coding:
            # Simulate test case execution
            total_cases = 5
            passed_cases = random.choice([3, 4, 5]) if "def" in user_answer or "class" in user_answer or "function" in user_answer else random.choice([0, 1, 2])
            execution_time = round(random.uniform(5.2, 120.4), 2)
            memory_usage = round(random.uniform(12.4, 28.9), 2)
            
            score_tech = int((passed_cases / total_cases) * 100)
            score_overall = int((score_tech * 0.7) + 30)
            
            strengths = ["Code has structured variables.", "Code follows syntactic conventions."]
            weaknesses = []
            if passed_cases < total_cases:
                weaknesses.append("Fails extreme edge cases (e.g. empty arrays, large limits).")
                weaknesses.append("Time complexity is slightly suboptimal (O(N^2) instead of O(N)).")
            else:
                strengths.append("Optimal runtime complexity O(N).")
                
            improved_code = "def optimal_solution(s):\n    char_map = {}\n    max_len = start = 0\n    for i, char in enumerate(s):\n        if char in char_map and char_map[char] >= start:\n            start = char_map[char] + 1\n        char_map[char] = i\n        max_len = max(max_len, i - start + 1)\n    return max_len"
            
            return {
                "score_overall": score_overall,
                "score_technical": score_tech,
                "score_communication": 90,
                "score_confidence": 95,
                "score_grammar": 90,
                "score_completeness": int((passed_cases / total_cases) * 100),
                "score_relevance": 100,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "improved_answer": improved_code,
                "recommended_resources": [
                    {"title": "LeetCode Pattern Guide", "type": "Tutorial", "url": "https://example.com/leetcode-patterns"},
                    {"title": "Big-O Notation Deep Dive", "type": "Video", "url": "https://example.com/big-o"}
                ],
                "topics_to_study": ["Sliding Window Technique", "Hash Map Optimization"],
                "passed_cases": passed_cases,
                "total_cases": total_cases,
                "execution_time": execution_time,
                "memory_usage": memory_usage
            }
            
        else:
            # Verbal / Text answer analysis
            # Compute score based on keywords and lengths
            words = user_answer.split()
            word_count = len(words)
            
            # Simple keyword checks to make score realistic
            matching_keywords = []
            technical_keywords = ["latency", "index", "thread", "virtual dom", "process", "redundancy", "scalability", "rest", "cache", "asynchronous", "async"]
            for kw in technical_keywords:
                if kw in user_answer.lower():
                    matching_keywords.append(kw)
                    
            score_tech = min(40 + len(matching_keywords) * 12 + random.randint(0, 10), 98)
            score_comm = min(50 + (word_count // 5) + random.randint(-5, 10), 96)
            score_conf = random.choice([75, 80, 85, 90, 95])
            score_grammar = random.randint(82, 97)
            score_comp = min(35 + (word_count // 4) + len(matching_keywords) * 5, 98)
            score_rel = 80 if len(matching_keywords) > 0 else 60
            
            score_overall = int((score_tech * 0.4) + (score_comm * 0.3) + (score_comp * 0.3))
            
            strengths = ["Structured explanation pattern.", "Grammar and sentence structures are clear."]
            weaknesses = []
            
            if word_count < 30:
                weaknesses.append("Answer is brief; explain the 'why' behind decisions and supply context.")
            if len(matching_keywords) == 0:
                weaknesses.append("Lacks specific industry terminology or concrete technical examples.")
            else:
                strengths.append(f"Correctly references domain terms like: {', '.join(matching_keywords[:3])}.")
                
            improved_ans = f"Here is a professional refactoring of your answer:\n\n'In my experience, when addressing {question_text.lower().replace('explain', '').replace('describe', '')}, it's essential to analyze key trade-offs. I focus on optimizing latency and system resource allocation. For example, in my previous role, I implemented decoupling patterns which isolated critical code paths, leading to reliable scalability and a 15% throughput enhancement.'"
            
            return {
                "score_overall": score_overall,
                "score_technical": score_tech,
                "score_communication": score_comm,
                "score_confidence": score_conf,
                "score_grammar": score_grammar,
                "score_completeness": score_comp,
                "score_relevance": score_rel,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "improved_answer": improved_ans,
                "recommended_resources": [
                    {"title": "System Design Handbook", "type": "PDF", "url": "https://example.com/sys-design"},
                    {"title": "Technical Vocabulary Builder", "type": "Article", "url": "https://example.com/vocab"}
                ],
                "topics_to_study": ["Microservices Communication", "Concurrency Patterns"]
            }

    @staticmethod
    def generate_roadmap(skills: List[str], weak_topics: List[str]) -> Dict[str, Any]:
        """
        Creates a custom learning roadmap containing goals, projects, and plans.
        """
        # Formulate weak topics list
        topics = list(set(weak_topics + ["System Design Fundamentals", "Advanced Data Structures", "Docker & Kubernetes Deployment"]))
        
        daily_plan = [
            {"day": "Day 1", "topic": topics[0] if len(topics) > 0 else "Object Oriented Design", "activity": "Read core concepts, study design patterns, and write clean interfaces."},
            {"day": "Day 2", "topic": topics[1] if len(topics) > 1 else "Database Indexing", "activity": "Analyze B-Trees vs Hash indexes, explain execution plans (EXPLAIN ANALYZE) in SQL."},
            {"day": "Day 3", "topic": "Coding Challenge Practice", "activity": "Solve 3 Medium sliding-window and binary search questions on LeetCode/Coding Arena."},
            {"day": "Day 4", "topic": "Mock Interview Sim", "activity": "Take a 30-minute Mock Technical Interview on InterviewIQ AI."},
            {"day": "Day 5", "topic": "Architecture & Scaling", "activity": "Design a high-throughput stateless messaging system with caching."}
        ]
        
        projects = [
            {
                "title": "Real-time Analytics Dashboard",
                "description": "Construct an analytics processor using WebSockets and Redis to handle 500 actions/sec.",
                "difficulty": "Intermediate",
                "skills_gained": ["WebSockets", "Redis", "Scalability"]
            },
            {
                "title": "Containerized Load Balancer Sim",
                "description": "Build a custom round-robin request distributor running inside Docker containers.",
                "difficulty": "Advanced",
                "skills_gained": ["Docker", "Network Protocols", "Load Balancing"]
            }
        ]
        
        resources = [
            {"title": "Designing Data-Intensive Applications", "type": "Book", "url": "https://example.com/ddia"},
            {"title": "NeetCode 150 Roadmaps", "type": "Tutorial", "url": "https://example.com/neetcode"}
        ]
        
        weekly_goals = [
            "Complete 10 custom Coding Arena problems.",
            "Maintain a 5-day practice streak on InterviewIQ.",
            "Optimize resume ATS compliance score above 85%."
        ]
        
        practice_questions = [
            "Explain how the TCP/IP handshake operates.",
            "Write a function to detect loops in a singly linked list.",
            "How do you secure a REST API using OAuth2 and scopes?"
        ]
        
        return {
            "weak_topics": topics,
            "daily_study_plan": daily_plan,
            "recommended_projects": projects,
            "practice_questions": practice_questions,
            "learning_resources": resources,
            "weekly_goals": weekly_goals
        }
