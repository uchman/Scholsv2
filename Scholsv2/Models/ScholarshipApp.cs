﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Schols.Models
{
    public class ScholarshipApp
    {
        public long id { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string middlename { get; set; }
        public string Email { get; set; }   //leaving here for compatibility. no longer in use
        public string phonenumber { get; set; }        
        public string address { get; set; }
        public string UniversityId { get; set; }
        public string fund_acct { get; set; }
        public string essayfilename { get; set; }
        public string reffilename { get; set; }
        public string UserName { get; set; }
        public string ScholarshipYear { get; set; }
        public string remark { get; set; }
        public string status { get; set; }
        public string ExpectedGraduation { get; set; }
        public string PresentGPA { get; set; }
        public string HighSchoolGPA { get; set; }
        public string CommunityService { get; set; }
        public string ExtraCurricular { get; set; }
        public string AwardsHonors { get; set; }
        public string SCHLRSHP_NUM { get; set; }
        public string ScholarshipName { get; set; }
        public string UserMajor { get; set; }
        public DateTime ApplyDate { get; set; }
        public string ApplyDateString { get; set; }
        public string SchoolYear { get; set; }
        public string IsTransfer { get; set; }
    }
}