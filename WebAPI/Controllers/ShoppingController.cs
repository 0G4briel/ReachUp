﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using ReachUp;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingController : ControllerBase
    {
        #region Actions

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
           return Ok(await new Shopping().Get());
        }

        //[Authorize(Roles ="adm")]
        [HttpPost("UpdateOpeningHours")]
        public async Task<IActionResult> UpdateOpeningHours([FromBody] Shopping shopping)
        {
            if (shopping != null)
                return Ok(await shopping.UpdateOpeningHours());
            return BadRequest("Parameters are null");
        }

        //[Authorize(Roles ="adm")]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] Shopping shopping)
        {
            if (shopping != null)
                return Ok(await shopping.Update());
            return BadRequest("Parameters are null");
        }

        #endregion
    }
}