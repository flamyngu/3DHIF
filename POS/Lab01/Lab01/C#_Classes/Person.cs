using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lab01.C__Classes
{
    public class Person(string firstName, string lastName, int age)
    {
        private string firstName { get; set; } = firstName;
        private string lastName { get; set; } = lastName;
        private int age { get; set; } = age;

        public string getFullName()
        {
            return firstName + " " + lastName;
        }

        public override string ToString()
        {
            return getFullName();
        }

        public bool isAdult()
        {
            if (age >= 18)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
