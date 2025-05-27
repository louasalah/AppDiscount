import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  // Hero section
  heroImageUrl: string = 'assets/images/orange-logo.png';
  
  // About section
  aboutImage1: string = 'assets/images/innovation.jpg';
  aboutImage2: string = 'assets/images/clients.jpg';
  
  
 
  
  
  // Footer section
  benefits = [
    '🔥 Promotions Exclusives',
    '🎟️ Codes de Réduction',
    '⏳ Offres à Durée Limitée'
  ];
  
  contacts = [
    'Grand public : 3111 111',
    'Business : 3111 222'
  ];
  
  footerCategories = [
    'Smartphones',
    'Offres Internet',
    'Accessoires'
  ];
  
  legalLinks = [
    'Mentions légales',
    'Conditions générales',
    'Politique de confidentialité'
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
    this.animateOnScroll();
  }

  // Method to show more when button is clicked
  showMore(): void {
    // Implement scroll to next section
    const aboutSection = document.querySelector('.who-we-are');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Method to add scroll animations
  private animateOnScroll(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    // Get all sections and observe them
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      observer.observe(section);
    });
  }
}