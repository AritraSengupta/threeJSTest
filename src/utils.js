export function calculatePoints(resume) {
  return Object.keys(resume).reduce(
    (prev, curr) => prev + resume[curr].points,
    0
  );
}

export function createCoin(value) {
  const innerHTML = `
    <div class="coin_container">
      <div class="coin">
        <div class="face heads">
          ${value}
        </div>
        <div class="face tails">
          ${value}
        </div>
      </div>
    </div>
  `;

  const elem = document.createElement("span");
  elem.innerHTML = innerHTML;
  return elem;
}

export function animateScore(obj, start, end, duration, totalScore, callback) {
  let startTimestamp = null;
  const step = timestamp => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const updatedScore = Math.floor(progress * (end - start) + start);
    obj.innerHTML = `Score: ${updatedScore} / ${totalScore}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
    if (updatedScore === end) {
      callback && callback();
    }
  };
  window.requestAnimationFrame(step);
}

export function createResume(obj, collections) {
  const keys = Object.keys(collections);

  const showProfile = true;
  const showSkills = true;
  const showTechnical = true;
  const showProjects = keys.includes("projects");
  const showEducation = keys.includes("education");
  const div = document.createElement("div");
  const defaultMessage = message => `
    <div class="talen"> You have yet to collect the ${message} coin </div>
  `;
  const template = `
    <div id="doc2" class="yui-t7">
      <div id="inner">
      
        <div id="hd">
          <div class="yui-gc">
            <div class="yui-u first">
              <h1>Jonathan Doe</h1>
              <h2>Web Designer, Director</h2>
            </div>

            <div class="yui-u">
              <div class="contact-info">
                <h3><a id="pdf" href="#">Download PDF</a></h3>
                <h3><a href="mailto:name@yourdomain.com">name@yourdomain.com</a></h3>
                <h3>(313) - 867-5309</h3>
              </div><!--// .contact-info -->
            </div>
          </div><!--// .yui-gc -->
        </div><!--// hd -->

        <div id="bd">
          <div id="yui-main">
            <div class="yui-b">

              <div class="yui-gf">
                <div class="yui-u first">
                  <h2>Profile</h2>
                </div>
                <div class="yui-u">
                  ${
                    showProfile
                      ? `
                    <p class="enlarge">
                      Progressively evolve cross-platform ideas before impactful infomediaries. Energistically visualize tactical initiatives before cross-media catalysts for change. 
                    </p>
                  `
                      : defaultMessage("profile")
                  }
                </div>
              </div><!--// .yui-gf -->

              <div class="yui-gf">
                <div class="yui-u first">
                  <h2>Skills</h2>
                </div>
                <div class="yui-u">

                    ${
                      showSkills
                        ? `
                      <div class="talent">
                        <h2>Web Design</h2>
                        <p>Assertively exploit wireless initiatives rather than synergistic core competencies.	</p>
                      </div>

                      <div class="talent">
                        <h2>Interface Design</h2>
                        <p>Credibly streamline mission-critical value with multifunctional functionalities.	 </p>
                      </div>

                      <div class="talent">
                        <h2>Project Direction</h2>
                        <p>Proven ability to lead and manage a wide variety of design and development projects in team and independent situations.</p>
                      </div>
                    `
                        : defaultMessage("skills")
                    }
                </div>
              </div><!--// .yui-gf -->

              <div class="yui-gf">
                <div class="yui-u first">
                  <h2>Technical</h2>
                </div>
                <div class="yui-u">
                  ${
                    showTechnical
                      ? `
                    <ul class="talent">
                      <li>XHTML</li>
                      <li>CSS</li>
                      <li class="last">Javascript</li>
                    </ul>

                    <ul class="talent">
                      <li>Jquery</li>
                      <li>PHP</li>
                      <li class="last">CVS / Subversion</li>
                    </ul>

                    <ul class="talent">
                      <li>OS X</li>
                      <li>Windows XP/Vista</li>
                      <li class="last">Linux</li>
                    </ul>        
                  `
                      : defaultMessage("techical")
                  }
                </div>
              </div><!--// .yui-gf-->

              <div class="yui-gf">   
                <div class="yui-u first">
                  <h2>Experience</h2>
                </div><!--// .yui-u -->

                <div class="yui-u">
                  ${
                    showProjects
                      ? `
                    <div class="job">
                      <h2>Facebook</h2>
                      <h3>Senior Interface Designer</h3>
                      <h4>2005-2007</h4>
                      <p>Intrinsicly enable optimal core competencies through corporate relationships. Phosfluorescently implement worldwide vortals and client-focused imperatives. Conveniently initiate virtual paradigms and top-line convergence. </p>
                    </div>

                    <div class="job">
                      <h2>Apple Inc.</h2>
                      <h3>Senior Interface Designer</h3>
                      <h4>2005-2007</h4>
                      <p>Progressively reconceptualize multifunctional "outside the box" thinking through inexpensive methods of empowerment. Compellingly morph extensive niche markets with mission-critical ideas. Phosfluorescently deliver bricks-and-clicks strategic theme areas rather than scalable benefits. </p>
                    </div>

                    <div class="job">
                      <h2>Microsoft</h2>
                      <h3>Principal and Creative Lead</h3>
                      <h4>2004-2005</h4>
                      <p>Intrinsicly transform flexible manufactured products without excellent intellectual capital. Energistically evisculate orthogonal architectures through covalent action items. Assertively incentivize sticky platforms without synergistic materials. </p>
                    </div>


                    <div class="job last">
                      <h2>International Business Machines (IBM)</h2>
                      <h3>Lead Web Designer</h3>
                      <h4>2001-2004</h4>
                      <p>Globally re-engineer cross-media schemas through viral methods of empowerment. Proactively grow long-term high-impact human capital and highly efficient innovation. Intrinsicly iterate excellent e-tailers with timely e-markets.</p>
                    </div>
                  `
                      : defaultMessage("Projects")
                  }

                </div><!--// .yui-u -->
              </div><!--// .yui-gf -->



              <div class="yui-gf last">
                <div class="yui-u first">
                  <h2>Education</h2>
                </div>
                <div class="yui-u">
                ${
                  showEducation
                    ? `
                  <h2>Indiana University - Bloomington, Indiana</h2>
                  <h3>Dual Major, Economics and English &mdash; <strong>4.0 GPA</strong> </h3>
                `
                    : defaultMessage("education")
                }
                </div>
              </div><!--// .yui-gf -->


            </div><!--// .yui-b -->
          </div><!--// yui-main -->
        </div><!--// bd -->

        <div id="ft">
          <p>Jonathan Doe &mdash; <a href="mailto:name@yourdomain.com">name@yourdomain.com</a> &mdash; (313) - 867-5309</p>
        </div><!--// footer -->

      </div><!-- // inner -->


    </div><!--// doc -->
  `;

  div.innerHTML = template;
  obj.appendChild(div);
  return obj;
}
