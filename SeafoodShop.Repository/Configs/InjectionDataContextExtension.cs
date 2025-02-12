using Microsoft.Extensions.DependencyInjection;
using SeafoodShop.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeafoodShop.Repository.Configs
{
    public static class InjectionDataContextExtension
    {
        public static void AddDataContextServices(this IServiceCollection services)
        {
            services.AddScoped<IProductRepository, ProductRepository>();
        }
    }
}
