from typing import List, Dict, Optional
from pydantic import BaseModel

class SubjectInfo(BaseModel):
    name: str
    description: str
    topics: List[str]
    examples: List[str]

class SubjectService:
    """Service for managing subject-specific information and topics"""
    
    def __init__(self):
        self.subjects = self._initialize_subjects()
    
    def _initialize_subjects(self) -> Dict[str, SubjectInfo]:
        """Initialize subject information"""
        return {
            "AP Calculus": SubjectInfo(
                name="AP Calculus",
                description="Advanced Placement Calculus covering differential and integral calculus with applications",
                topics=[
                    "Limits and Continuity",
                    "Derivatives and Differentiation Rules",
                    "Applications of Derivatives",
                    "Integrals and Integration Techniques",
                    "Applications of Integrals",
                    "Differential Equations",
                    "Series and Sequences",
                    "Parametric Equations",
                    "Polar Coordinates",
                    "Vector-Valued Functions"
                ],
                examples=[
                    "Find the derivative of f(x) = x²·sin(x)",
                    "Calculate the area between curves y = x² and y = 2x",
                    "Solve the differential equation dy/dx = 2x + y",
                    "Find the limit as x approaches 0 of sin(x)/x",
                    "Evaluate the integral ∫(x² + 2x + 1)dx"
                ]
            ),
            
            "AP Physics": SubjectInfo(
                name="AP Physics",
                description="Advanced Placement Physics covering mechanics, electricity, and magnetism",
                topics=[
                    "Kinematics and Motion",
                    "Forces and Newton's Laws",
                    "Work, Energy, and Power",
                    "Linear Momentum and Collisions",
                    "Circular Motion and Gravitation",
                    "Rotational Motion",
                    "Simple Harmonic Motion",
                    "Electric Charges and Fields",
                    "Electric Potential and Capacitance",
                    "Current and Resistance",
                    "Magnetic Fields and Forces",
                    "Electromagnetic Induction",
                    "Wave Phenomena"
                ],
                examples=[
                    "Calculate the acceleration of a block on an inclined plane",
                    "Find the velocity of a projectile at maximum height",
                    "Determine the force between two charged particles",
                    "Calculate the period of a simple pendulum",
                    "Find the current in a series circuit with resistors"
                ]
            ),
            
            "AP Chemistry": SubjectInfo(
                name="AP Chemistry",
                description="Advanced Placement Chemistry covering atomic structure, reactions, and thermodynamics",
                topics=[
                    "Atomic Structure and Periodicity",
                    "Chemical Bonding and Molecular Geometry",
                    "States of Matter and Intermolecular Forces",
                    "Chemical Reactions and Stoichiometry",
                    "Thermochemistry and Thermodynamics",
                    "Chemical Kinetics",
                    "Chemical Equilibrium",
                    "Acid-Base Chemistry",
                    "Electrochemistry",
                    "Nuclear Chemistry",
                    "Organic Chemistry Fundamentals"
                ],
                examples=[
                    "Balance the chemical equation: Fe + O₂ → Fe₂O₃",
                    "Calculate the pH of a 0.1M HCl solution",
                    "Find the equilibrium constant for a reaction",
                    "Determine the molecular geometry of H₂O",
                    "Calculate the heat of reaction using bond energies"
                ]
            ),
            
            "AMC Math": SubjectInfo(
                name="AMC Math",
                description="American Mathematics Competitions covering algebra, geometry, and problem-solving",
                topics=[
                    "Algebra and Functions",
                    "Geometry and Trigonometry",
                    "Number Theory",
                    "Combinatorics and Probability",
                    "Sequences and Series",
                    "Complex Numbers",
                    "Polynomials and Equations",
                    "Inequalities",
                    "Problem-Solving Strategies",
                    "Proof Techniques"
                ],
                examples=[
                    "Find all real solutions to x² + 5x + 6 = 0",
                    "Calculate the area of a triangle with sides 3, 4, 5",
                    "How many ways can 5 people sit around a circular table?",
                    "Find the sum of the first 100 positive integers",
                    "Prove that √2 is irrational"
                ]
            )
        }
    
    def get_available_subjects(self) -> List[str]:
        """Get list of available subject names"""
        return list(self.subjects.keys())
    
    def get_subject_info(self) -> List[SubjectInfo]:
        """Get information for all subjects"""
        return list(self.subjects.values())
    
    def get_subject_info_by_name(self, subject_name: str) -> Optional[SubjectInfo]:
        """Get information for a specific subject"""
        return self.subjects.get(subject_name)
    
    def get_topics_for_subject(self, subject_name: str) -> List[str]:
        """Get topics for a specific subject"""
        subject = self.get_subject_info_by_name(subject_name)
        return subject.topics if subject else []
    
    def get_examples_for_subject(self, subject_name: str) -> List[str]:
        """Get example problems for a specific subject"""
        subject = self.get_subject_info_by_name(subject_name)
        return subject.examples if subject else []
    
    def search_subjects_by_topic(self, topic: str) -> List[str]:
        """Search subjects that cover a specific topic"""
        matching_subjects = []
        topic_lower = topic.lower()
        
        for subject_name, subject_info in self.subjects.items():
            if any(topic_lower in topic_name.lower() for topic_name in subject_info.topics):
                matching_subjects.append(subject_name)
        
        return matching_subjects
    
    def get_related_topics(self, subject_name: str, topic: str) -> List[str]:
        """Get related topics within a subject"""
        subject = self.get_subject_info_by_name(subject_name)
        if not subject:
            return []
        
        topic_lower = topic.lower()
        related = []
        
        for subject_topic in subject.topics:
            if topic_lower in subject_topic.lower() or subject_topic.lower() in topic_lower:
                related.append(subject_topic)
        
        return related
    
    def get_subject_statistics(self) -> Dict[str, Dict[str, int]]:
        """Get statistics about subjects"""
        stats = {}
        
        for subject_name, subject_info in self.subjects.items():
            stats[subject_name] = {
                "topics_count": len(subject_info.topics),
                "examples_count": len(subject_info.examples)
            }
        
        return stats 