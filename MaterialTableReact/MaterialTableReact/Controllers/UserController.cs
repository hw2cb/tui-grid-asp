using MaterialTableReact.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaterialTableReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("employees")]
        public IActionResult GetData()
        {
            List<Employee> employees = new List<Employee>(10000);
            List<string> gender = new List<string>()
            {
                "Male",
                "Female"
            };
            List<string> col = new()
            {
                "red",
                "blue",
                "orange",
                "green",
                "black"
            };
            Random rnd = new Random();
            for (int i = 0; i < 10000; i++)
            {
                employees.Add(new Employee
                {
                    Name = Faker.Name.FullName(),
                    Progress = rnd.Next(0, 100),
                    Gender = gender[rnd.Next(0, 2)],
                    Rating = rnd.Next(0, 10),
                    Col = col[rnd.Next(0, 5)],
                    Dob = new DateTime(2023, 03, 01).AddDays(-rnd.Next(10000)),
                    Car = Convert.ToBoolean(rnd.Next(0, 2))
                });
            }
            return Ok(new { result = true, data = new { contents = employees } });
        }
    }
}
