'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'georgian' | 'english';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  georgian: {
    ensembleName: 'ანსამბლი "სამშობლო"',
    heroDescription: 'შემოუერთდით ჩვენს ანსამბლს და გახდით საუკუნეების ტრადიციის ნაწილი',
    agesInfo: 'ასაკი 5-15 • ყველა დონის მოცეკვავე • პროფესიონალური სწავლება',
    registerButton: 'დარეგისტრირდი ახლა',
    aboutTitle: 'ანსამბლის შესახებ',
    culturalHeritage: 'შესწავლის ტექნიკები',
    culturalHeritageDesc: 'სტუდიაში დაგხვდებათ ბავშვებზე ორიენტირებული, მზრუნველი, მეგობრული და უსაფრთხო გარემო, სადაც მოსწვლეები თანამედროვე, ბავშვებისთვის განკუთვნილი სპეციალური ტექნიკებით და მიდგომებით შეისწავლიან როგორც ცეკვას, ასევე გუნდურ მუშაობას. ჩვენთან ბავშვები მიიღებენ როგორც პრაქტიკულ ასევე თეორიულ ცოდნას.',
    professionalTraining: 'პედაგოგები',
    professionalTrainingDesc: 'ცეკვას შეასწავლიან ანსამბლ ერისიონის ყოფილი მოცეკვავე, სერგო ზაქარიაძის უნივერსიტეტის ქორეოგრაფიული მიმართულების კურსდამთავრებული, მედეა ჩახავას თეატრალური აკადემიის ქართული ქორეოგრაფიის თეორიის ლექტორი და ანსამბლ სამშობლოს დამფუძნებელი - <a href="https://www.facebook.com/levani.wiklauri.9022" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 font-semibold no-underline transition-colors duration-300">ლევან წიკლაური</a>. შოთა რუსთაველის სახელობის თეატრისა და კინოს სახელმწიფო უნივერსიტეტის ქორეოგრაფიული მიმართულების კურსდამთავრებული და მოქმედი მოცეკვავე - <a href="https://www.facebook.com/sophoomarashvili" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 font-semibold no-underline transition-colors duration-300">სოფო ომარაშვილი</a>',
    performanceOpportunities: 'შესაძლებლობები',
    performanceOpportunitiesDesc: 'ბავშვები მიიღებენ მონაწილეობას როგორც საქართველოში გამართულ ფესტივლებზე, ასევე საერთაშორისო კონკურს-ფესტივლებზე საქართველოს საზღვრებს გარეთ. 14+ ასაკის მოზარდებს ექნებათ შესაძლებლობა, მიიღონ მონაწილეობა დაფინანსებულ კონკურსებზე საზღვარგარეთ.',
    joinTitle: 'შემოუერთდით ჩვენს ანსამბლს',
    joinSubtitle: 'დაარეგისტრირეთ თქვენი შვილი ანსამბლში',
    childInfo: 'ბავშვის ინფორმაცია',
    childName: 'ბავშვის სახელი *',
    childSurname: 'ბავშვის გვარი *',
    childAge: 'ბავშვის ასაკი *',
    parentInfo: 'მშობლის ინფორმაცია',
    parentName: 'მშობლის სახელი *',
    parentSurname: 'მშობლის გვარი *',
    parentPhone: 'მშობლის ტელეფონის ნომერი *',
    submitRegistration: 'დარეგისტრირდი',
    submitting: 'იგზავნება...',
    successMessage: 'რეგისტრაცია წარმატებით გაიგზავნა! მალე დაგიკავშირდებით.',
    errorMessage: 'რეგისტრაციის გაგზავნისას შეცდომა მოხდა. გთხოვთ თავიდან სცადოთ.',
    enterChildName: 'შეიყვანეთ ბავშვის სახელი',
    enterChildSurname: 'შეიყვანეთ ბავშვის გვარი',
    enterAge: 'შეიყვანეთ ასაკი (5-15)',
    enterParentName: 'შეიყვანეთ მშობლის სახელი',
    enterParentSurname: 'შეიყვანეთ მშობლის გვარი',
    enterPhone: 'შეიყვანეთ ტელეფონის ნომერი',
    adminAccess: 'ადმინისტრატორის წვდომა',
    adminSubtitle: 'შეიყვანეთ პაროლი რეგისტრაციების სანახავად',
    password: 'პაროლი',
    enterPassword: 'შეიყვანეთ ადმინისტრატორის პაროლი',
    accessAdminPanel: 'შესვლა',
    authenticating: 'შემოწმება...',
    adminPanel: 'ადმინისტრატორის პანელი',
    adminSubtitle2: 'ქართული ცეკვის ანსამბლის რეგისტრაციები',
    totalRegistrations: 'სულ რეგისტრაცია:',
    noRegistrations: 'რეგისტრაცია არ არის ნაპოვნი',
    registration: 'რეგისტრაცია #',
    childInformation: 'ბავშვის ინფორმაცია',
    parentInformation: 'მშობლის ინფორმაცია',
    name: 'სახელი:',
    age: 'ასაკი:',
    phone: 'ტელეფონი:',
    yearsOld: 'წლის',
    copyDetails: 'დეტალების კოპირება',
    refresh: 'განახლება',
    refreshing: 'განახლდება...',
    logout: 'გასვლა'
  },
  english: {
    ensembleName: 'Ensemble "SamShoblo"',
    heroDescription: 'Experience the grace, passion, and cultural heritage of traditional Georgian dance. Join our ensemble and become part of a centuries-old tradition.',
    agesInfo: 'Ages 5-15 • All skill levels welcome • Professional instruction',
    registerButton: 'Register Now',
    aboutTitle: 'About Our Ensemble',
    culturalHeritage: 'Study Techniques',
    culturalHeritageDesc: 'You will find a child-focused, caring, friendly, and safe environment where students learn both dance and teamwork using modern, child-specific techniques and approaches. With us, children will receive both practical and theoretical knowledge.',
    professionalTraining: 'Our Teachers',
    professionalTrainingDesc: 'Dance will be taught by <a href="https://www.facebook.com/levani.wiklauri.9022" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 font-semibold no-underline transition-colors duration-300">Levan Tsiklauri</a>, former dancer of Ensemble Erisioni, graduate of Sergo Zakariadze University\'s choreographic direction, lecturer of Georgian choreography theory at Medea Chakhava Theater Academy, and founder of Ensemble Samshoblo. Also by <a href="https://www.facebook.com/sophoomarashvili" target="_blank" rel="noopener noreferrer" class="text-amber-400 hover:text-amber-300 font-semibold no-underline transition-colors duration-300">Sopho Omarashvili</a>, graduate of Shota Rustaveli Theater and Film State University\'s choreographic direction and active dancer.',
    performanceOpportunities: 'Opportunities',
    performanceOpportunitiesDesc: 'Children will participate in festivals held in Georgia, as well as international competitions outside Georgia\'s borders. Teenagers aged 14+ will have the opportunity to participate in funded competitions abroad.',
    joinTitle: 'Join Our Ensemble',
    joinSubtitle: 'Register your child for the Georgian Dance Ensemble',
    childInfo: 'Child Information',
    childName: 'Child\'s Name *',
    childSurname: 'Child\'s Surname *',
    childAge: 'Child\'s Age *',
    parentInfo: 'Parent Information',
    parentName: 'Parent\'s Name *',
    parentSurname: 'Parent\'s Surname *',
    parentPhone: 'Parent\'s Phone Number *',
    submitRegistration: 'Submit Registration',
    submitting: 'Submitting...',
    successMessage: 'Registration submitted successfully! We\'ll contact you soon.',
    errorMessage: 'There was an error submitting your registration. Please try again.',
    enterChildName: 'Enter child\'s name',
    enterChildSurname: 'Enter child\'s surname',
    enterAge: 'Enter age (5-15)',
    enterParentName: 'Enter parent\'s name',
    enterParentSurname: 'Enter parent\'s surname',
    enterPhone: 'Enter phone number',
    adminAccess: 'Admin Access',
    adminSubtitle: 'Enter password to view registrations',
    password: 'Password',
    enterPassword: 'Enter admin password',
    accessAdminPanel: 'Access Admin Panel',
    authenticating: 'Authenticating...',
    adminPanel: 'Admin Panel',
    adminSubtitle2: 'Georgian Dance Ensemble Registrations',
    totalRegistrations: 'Total Registrations:',
    noRegistrations: 'No registrations found',
    registration: 'Registration #',
    childInformation: 'Child Information',
    parentInformation: 'Parent Information',
    name: 'Name:',
    age: 'Age:',
    phone: 'Phone:',
    yearsOld: 'years old',
    copyDetails: 'Copy Details',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    logout: 'Logout'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('georgian');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'georgian' ? 'english' : 'georgian');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
