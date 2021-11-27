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
              <h1>Aritra Sengupta, Ph.D.</h1>
              <h2>Software Engineer</h2>
            </div>

            <div class="yui-u">
              <div class="contact-info">
                <h3><a href="mailto:aritra55@ygmail.com">aritra55@ygmail.com</a></h3>
                <h3>+917499158960</h3>
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
                        <h2>Javascript</h2>
                        <ul>
                          <li>React</li>
                          <li>React Native</li>
                          <li>NodeJS</li>
                        <ul>
                      </div>

                      <div class="talent">
                        <h2>APIs</h2>
                        <ul>
                          <li>REST APIs</li>
                          <li>GraphQL</li>
                          <li>Apollo</li>
                        <ul>
                      </div>

                      <div class="talent">
                        <h2>CI / CD</h2>
                        <ul>
                          <li>Jenkins</li>
                          <li>Github pipelines</li>
                        <ul>
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
                      <h2>Catapharma Pvt Ltd.</h2>
                      <h3>VP, IT Systems</h3>
                      <h4>2020 - current</h4>
                      <ul>
                        <li> Leading a team of 4 people to design an inhouse ERP system to track inventory and accounts </li>
                        <li> Built the architecture from scratch for both the frontend and backend </li>
                        <li> Designed and documented the REST APIs </li>
                        <li> Built an agile work environment and track progress using scrum </li>
                      </ul>
                    </div>

                    <div class="job">
                      <h2>Medallia Inc.</h2>
                      <h3>Senior Software Engineer</h3>
                      <h4>2016-2020</h4>
                      <ul>
                        <li> Designed REST APIs for various deployer and deployer related technologies for the Infrastructure team </li>
                        <li> Implemented the APIs and build web interfaces using React and Angular deployed in Medallia Cloud </li>
                        <li> Designed the client facing UI for ‘sandbox’ feature, which is currently used by 75% of Medallia’s clients </li>
                        <li> Worked on developing the company app from scratch using React Native </li>
                        <li> Developed a pipeline to automate the process of branded apps for clients </li>
                      </ul>
                    </div>
                  `
                      : defaultMessage("Projects")
                  }

                </div><!--// .yui-u -->
              </div><!--// .yui-gf -->

              <div class="yui-gf">
                <div class="yui-u first">
                  <h2>Publication</h2>
                </div>
                <div class="yui-u">
                  <p>
                    B. Sarkar, A. Sengupta, S. De, S. DasGupta, Prediction of permeate flux during electric field enhanced
                    cross-flow ultrafiltration - A neural network approach, Separation and Purification Technology (2008)
                  </p>
                </div>
              </div>

              <div class="yui-gf last">
                <div class="yui-u first">
                  <h2>Education</h2>
                </div>
                <div class="yui-u">
                ${
                  showEducation
                    ? `
                  <h2>Georgia Institute of Technology, Atlanta, GA</h2>
                  <h3>Ph.D. Chemical and Biomolecular Engineering &mdash; <strong>3.96 / 4.0 GPA</strong> </h3>
                  <h3>Minor in Industrial Engineering &mdash; <strong>3.96 / 4.0 GPA</strong></h3>
                  <br />
                  <h2>Indian Institute of Technology, Kharagpur, India</h2>
                  <h3>B.Tech. Chemical Engineering &mdash; <strong>8.75 / 10.0 GPA</strong> </h3>
                `
                    : defaultMessage("education")
                }
                </div>
              </div><!--// .yui-gf -->


            </div><!--// .yui-b -->
          </div><!--// yui-main -->
        </div><!--// bd -->

        <div id="ft">
          <p>Aritra Sengupta &mdash; <a href="mailto:aritra55@gmail.com">aritra55@gmail.com</a> &mdash; +917499158960</p>
        </div><!--// footer -->

      </div><!-- // inner -->


    </div><!--// doc -->
  `;

  div.innerHTML = template;
  obj.appendChild(div);
  return obj;
}

export function gameOver() {
  const innerHTML = `
    <div class="coin_container">
      <div class="coin">
        <div class="face heads">
          Game Over
        </div>
        <div class="face tails">
          Game Over
        </div>
      </div>
    </div>
  `;

  const elem = document.createElement("span");
  elem.innerHTML = innerHTML;
  return elem;
}
