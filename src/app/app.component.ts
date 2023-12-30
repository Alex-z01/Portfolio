import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CockroachService, Project } from './components/cockroach/cockroach-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    @ViewChild('projectSection') projectSection?: ElementRef;

    functionEndpoint = 'https://main--calm-cat-bdfe20.netlify.app/.netlify/functions/projects';

    expanded: boolean = false;
    allProjects: Project[] = [];
    filteredProjects: Project[] = [];
    expandedLetters?: HTMLElement;

    constructor(private cockroachService: CockroachService, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.createLetters();
    }

    updateExpand(expanded: boolean) {
        this.expanded = expanded;
    }

    loadProjects(letter: string = ''): void {
        this.cockroachService.fetchProjects(letter).subscribe(
            (data: Project[]) => {
                this.allProjects = data;
            },
            (error) => {
                console.error('Error fetching projects:', error);
            }
        );
    }

    createLetters(): void {
        this.expandedLetters = this.renderer.selectRootElement('#expanded-letters');

        var initials = document.getElementsByClassName('initial');
        for(let i = 0; i < initials.length; i++) {
            const initial = initials[i];

            initial.addEventListener('click', () => this.handleLetterClick(initial.textContent || ''));
        }

        for (let charCode = 98; charCode <= 121; charCode++) {
            const letter = String.fromCharCode(charCode);
            const h1 = this.renderer.createElement('h1');
            h1.classList.add('expanded-letter');
            h1.textContent = letter;

            this.renderer.listen(h1, 'click', () => {
                this.handleLetterClick(letter).then(() => {});
            });

            this.renderer.appendChild(this.expandedLetters, h1);
        }
    }

    async handleLetterClick(letter: string): Promise<void> {
        if(!this.expanded) return;

        console.log(`Displaying projects for ${letter}`);
        this.filteredProjects = await this.filterByLetter(letter);

        if (this.filteredProjects.length > 0 && this.projectSection) {
            this.projectSection.nativeElement.style.display = 'flex';
            this.projectSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        } else if (this.projectSection) {
            this.projectSection.nativeElement.style.display = 'none';
        }
    }

    async filterByLetter(letter: string): Promise<Project[]> {
        try {
            const response = await fetch(`${this.functionEndpoint}?letter=${letter}`);
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(`Failed to fetch projects: ${data.error}`);
            }
    
            return data.projects as Project[];
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error if needed for further handling
        }
    }
}