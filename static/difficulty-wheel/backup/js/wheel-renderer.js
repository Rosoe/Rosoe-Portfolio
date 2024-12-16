const WheelRenderer = {
    render() {
        const svg = document.getElementById('wheel');
        svg.innerHTML = ''; // Clear existing content

        const innerRadius = 180;
        const outerRadius = 350;
        const center = 400;
        const sectionAngle = (2 * Math.PI) / Object.keys(categories).length;

        // Add definitions for filters
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'textShadow');
        
        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        feDropShadow.setAttribute('dx', '0');
        feDropShadow.setAttribute('dy', '0');
        feDropShadow.setAttribute('stdDeviation', '1.5');
        feDropShadow.setAttribute('flood-color', 'black');
        feDropShadow.setAttribute('flood-opacity', '0.3');
        
        filter.appendChild(feDropShadow);
        defs.appendChild(filter);
        svg.appendChild(defs);

        Object.entries(categories).forEach(([category, { color, subcategories }], index) => {
            const startAngle = index * sectionAngle - Math.PI / 2;
            const endAngle = startAngle + sectionAngle;

            // Main category section
            const mainSection = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            mainSection.setAttribute('d', `M ${center} ${center} 
                L ${center + innerRadius * Math.cos(startAngle)} ${center + innerRadius * Math.sin(startAngle)} 
                A ${innerRadius} ${innerRadius} 0 0 1 ${center + innerRadius * Math.cos(endAngle)} ${center + innerRadius * Math.sin(endAngle)} Z`);
            mainSection.setAttribute('fill', color);
            mainSection.setAttribute('fill-opacity', State.getCategoryOpacity(category));
            svg.appendChild(mainSection);

            // Category label
            const labelAngle = startAngle + sectionAngle / 2;
            const labelRadius = innerRadius * 0.6;
            const labelX = center + labelRadius * Math.cos(labelAngle);
            const labelY = center + labelRadius * Math.sin(labelAngle);

            const categoryLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            categoryLabel.setAttribute('x', labelX);
            categoryLabel.setAttribute('y', labelY);
            categoryLabel.setAttribute('text-anchor', 'middle');
            categoryLabel.setAttribute('fill', 'white');
            categoryLabel.setAttribute('font-weight', 'bold');
            categoryLabel.setAttribute('filter', 'url(#textShadow)');
            const categoryRotation = Utils.getTextRotation(labelAngle);
            categoryLabel.setAttribute('transform', `rotate(${categoryRotation}, ${labelX}, ${labelY})`);
            categoryLabel.textContent = category;
            svg.appendChild(categoryLabel);

            // Subcategory sections
            const subAngle = sectionAngle / Object.keys(subcategories).length;
            Object.keys(subcategories).forEach((sub, subIndex) => {
                const subStartAngle = startAngle + subAngle * subIndex;
                const subEndAngle = subStartAngle + subAngle;

                const subSection = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                subSection.setAttribute('d', `M ${center + innerRadius * Math.cos(subStartAngle)} ${center + innerRadius * Math.sin(subStartAngle)}
                    L ${center + outerRadius * Math.cos(subStartAngle)} ${center + outerRadius * Math.sin(subStartAngle)}
                    A ${outerRadius} ${outerRadius} 0 0 1 ${center + outerRadius * Math.cos(subEndAngle)} ${center + outerRadius * Math.sin(subEndAngle)}
                    L ${center + innerRadius * Math.cos(subEndAngle)} ${center + innerRadius * Math.sin(subEndAngle)}
                    A ${innerRadius} ${innerRadius} 0 0 0 ${center + innerRadius * Math.cos(subStartAngle)} ${center + innerRadius * Math.sin(subStartAngle)}`);
                subSection.setAttribute('fill', color);
                subSection.setAttribute('fill-opacity', State.difficulties[`${category}-${sub}`] / 10);
                subSection.setAttribute('stroke', 'white');
                subSection.setAttribute('stroke-width', '1');
                svg.appendChild(subSection);

                // Calculate dynamic font size based on segment size
                const segmentHeight = outerRadius - innerRadius;
                const segmentWidth = 2 * Math.PI * ((innerRadius + outerRadius) / 2) * (subAngle / (2 * Math.PI));
                const fontSize = Math.min(segmentHeight * 0.15, segmentWidth * 0.2);

                // Subcategory label
                const textAngle = subStartAngle + subAngle / 2;
                const textRadiusAdjustment = Math.min(sub.length * 0.5, 15);
                const midRadius = (innerRadius + outerRadius) / 2 - textRadiusAdjustment;
                const textX = center + midRadius * Math.cos(textAngle);
                const textY = center + midRadius * Math.sin(textAngle);

                const subLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                subLabel.setAttribute('x', textX);
                subLabel.setAttribute('y', textY);
                subLabel.setAttribute('text-anchor', 'middle');
                subLabel.setAttribute('font-size', `${fontSize}px`);
                subLabel.setAttribute('fill', 'white');
                subLabel.setAttribute('filter', 'url(#textShadow)');
                
                const textRotation = Utils.getTextRotation(textAngle);
                subLabel.setAttribute('transform', `rotate(${textRotation}, ${textX}, ${textY})`);

                const wrappedText = Utils.wrapText(sub);
                wrappedText.forEach((line, lineIndex) => {
                    const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    tspan.setAttribute('x', textX);
                    tspan.setAttribute('dy', lineIndex === 0 ? '0' : '1.2em');
                    tspan.setAttribute('text-anchor', 'middle');
                    tspan.textContent = line;
                    subLabel.appendChild(tspan);
                });
                svg.appendChild(subLabel);
            });
        });

        // Center circle and game name
        const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        centerCircle.setAttribute('cx', center);
        centerCircle.setAttribute('cy', center);
        centerCircle.setAttribute('r', '50');
        centerCircle.setAttribute('fill', 'white');
        svg.appendChild(centerCircle);

        const gameNameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        gameNameText.setAttribute('x', center);
        gameNameText.setAttribute('y', center + 5);
        gameNameText.setAttribute('text-anchor', 'middle');
        gameNameText.setAttribute('font-weight', 'bold');
        gameNameText.textContent = document.getElementById('gameName').value;
        svg.appendChild(gameNameText);
    }
};
