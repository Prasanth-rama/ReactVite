// Data/DbSeeder.cs
using EmployeeApi.Models;

namespace EmployeeApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Employees.Any()) return;   // only seed an empty table

        var employees = new List<Employee>
        {
  
     
            new() { FullName="Aarav Sharma",     Email= "aarav.sharma@company.com", EmploymentType="Full-time",    Role= "Software Engineer",        Department= "Engineering", JoiningDate= DateTime.Parse("2024-03-11"), OnboardingStatus= "Completed",   Status= "Active" },
   new()  { FullName= "Priya Reddy",      Email= "priya.reddy@company.com",  EmploymentType="Full-time",    Role= "Senior Software Engineer", Department= "Engineering", JoiningDate= DateTime.Parse("2022-07-04"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Rohan Mehta",      Email= "rohan.mehta@company.com",  EmploymentType="Part-time",    Role= "QA Engineer",              Department= "Engineering", JoiningDate= DateTime.Parse("2025-01-20"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Sneha Iyer",       Email= "sneha.iyer@company.com",   EmploymentType="Intern",    Role= "DevOps Engineer",          Department= "Engineering", JoiningDate= DateTime.Parse("2023-09-18"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Karthik Nair",     Email= "karthik.nair@company.com", EmploymentType="Contarctor",    Role= "Junior Developer",         Department= "Engineering", JoiningDate= DateTime.Parse("2026-10-05"), OnboardingStatus= "In Progress", Status= "Active" },


   new() { FullName= "Ananya Gupta",     Email= "ananya.gupta@company.com", EmploymentType="Full-time",    Role= "UI/UX Designer",           Department= "Design",      JoiningDate= DateTime.Parse("2023-05-15"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Vikram Singh",     Email= "vikram.singh@company.com", EmploymentType="Part-time",    Role= "Graphic Designer",         Department= "Design",      JoiningDate= DateTime.Parse("2024-08-12"), OnboardingStatus= "Completed",   Status= "Exited" },
   new() { FullName= "Meera Joshi",      Email= "meera.joshi@company.com",  EmploymentType="Intern",    Role= "Design Intern",            Department= "Design",      JoiningDate= DateTime.Parse("2026-10-01"), OnboardingStatus= "Not Started", Status= "Active" },

   new() { FullName= "Arjun Patel",      Email= "arjun.patel@company.com",  EmploymentType="Full-time",    Role= "Product Manager",          Department= "Product",     JoiningDate= DateTime.Parse("2022-02-14"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Divya Menon",      Email= "divya.menon@company.com",  EmploymentType="Part-time",    Role= "Business Analyst",         Department= "Product",     JoiningDate= DateTime.Parse("2024-11-25"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Rahul Verma",      Email= "rahul.verma@company.com",  EmploymentType="Intern",    Role= "Product Owner",            Department= "Product",     JoiningDate=DateTime.Parse( "2026-10-07"), OnboardingStatus= "In Progress", Status= "Active" },

   new() { FullName= "Neha Kapoor",      Email= "neha.kapoor@company.com",  EmploymentType="Full-time",    Role= "HR Manager",               Department= "HR",          JoiningDate=DateTime.Parse( "2021-06-21"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Suresh Kumar",     Email= "suresh.kumar@company.com", EmploymentType="Part-time",    Role= "Recruiter",                Department= "HR",          JoiningDate=DateTime.Parse( "2025-04-07"), OnboardingStatus= "Completed",   Status= "Active" },

   new() { FullName= "Pooja Desai",      Email= "pooja.desai@company.com",  EmploymentType="Full-time",   Role= "Sales Executive",          Department= "Sales",       JoiningDate=DateTime.Parse( "2024-02-19"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Aditya Rao",       Email= "aditya.rao@company.com",   EmploymentType="Part-time",    Role= "Sales Manager",            Department= "Sales",       JoiningDate= DateTime.Parse("2021-10-11"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Isha Bansal",      Email= "isha.bansal@company.com",  EmploymentType="Intern",    Role= "Account Executive",        Department= "Sales",       JoiningDate= DateTime.Parse("2025-09-01"), OnboardingStatus= "Completed",   Status= "On Leave" },
   new() { FullName= "Manoj Pillai",     Email= "manoj.pillai@company.com", EmploymentType="Contarctor",    Role= "Sales Associate",          Department= "Sales",       JoiningDate= DateTime.Parse("2026-10-09"), OnboardingStatus= "Completed",   Status= "Active" },

   new() { FullName= "Lakshmi Narayan",  Email= "lakshmi.narayan@company.com", EmploymentType="Full-time",  Role= "Accountant",               Department= "Finance",     JoiningDate=DateTime.Parse( "2023-03-06"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Deepak Chopra",    Email= "deepak.chopra@company.com",   EmploymentType="Part-time", Role= "Finance Manager",          Department= "Finance",     JoiningDate= DateTime.Parse("2022-12-05"), OnboardingStatus= "Completed",   Status= "Active" },
   new() { FullName= "Kavya Shetty",     Email= "kavya.shetty@company.com",   EmploymentType="Intern",  Role= "Financial Analyst",        Department= "Finance",     JoiningDate=DateTime.Parse( "2026-10-02"), OnboardingStatus= "Completed",   Status= "Active" },
            // ...add the remaining 17 here
        };

        db.Employees.AddRange(employees);
        db.SaveChanges();
    }
}